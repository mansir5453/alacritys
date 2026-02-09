// navigation




// Safety: Ensure surveyResponses object exists to prevent crashes in Admin Mode
window.surveyResponses = window.surveyResponses || {};
window.estimateData = window.estimateData || {};

// Handle Offer Selection Click (Moved to top for inline onclick availability)
window.selectCurrentOffer = function (btnElement) {
  // Get the Offer Name - check details section FIRST (has correct name), modal as fallback
  let planName = document.getElementById('detailsPlanName')?.textContent ||
    document.getElementById('modalDetailsPlanName')?.textContent ||
    document.getElementById('modalPlanName')?.textContent ||
    'Unknown Offer';

  // Skip if it's still the default "Most Popular" placeholder
  planName = planName.trim();
  if (planName === 'Most Popular') {
    // Try to get from the active offer card instead
    const activeCard = document.querySelector('.offer-item.active');
    if (activeCard) {
      planName = activeCard.querySelector('.offer-name')?.textContent?.trim() || planName;
    }
  }
  // console.log(`Selected offer: "${planName}"`);

  // Update Local Store
  if (!window.surveyResponses) window.surveyResponses = {};
  window.surveyResponses.selectedOffer = planName;

  // PERSIST: Save to localStorage as backup
  localStorage.setItem('selected_offer_backup', planName);

  // SYNC: Update legacy global variable
  if (typeof chosenOfferName !== 'undefined') {
    chosenOfferName = planName;
  }
  window.chosenOfferName = planName;

  // Update 'Selected Offer' summary text
  const chosenOfferEl = document.getElementById('chosenOffer');
  if (chosenOfferEl) {
    chosenOfferEl.textContent = planName;
    chosenOfferEl.style.color = '#e50215';
    chosenOfferEl.style.fontWeight = 'bold';
  }

  // --- FIX: Update Services Display ---
  if (typeof updateOfferServicesDisplay === 'function' && window.currentServices) {
    updateOfferServicesDisplay(planName, window.currentServices);
  }

  // Update Button State
  if (window.updateChooseBtnState) {
    window.updateChooseBtnState(planName);
    setTimeout(() => window.updateChooseBtnState(planName), 50);
    setTimeout(() => window.updateChooseBtnState(planName), 200);
  }

  // Trigger Partial Save
  if (typeof window.saveEnhancedData === 'function') {
    window.saveEnhancedData(planName);
  }

  // --- FIX: Close Modal ---
  const modal = document.getElementById('offerModal');
  if (modal) modal.style.display = 'none';

  // Recalculate if needed
  if (typeof calculateCost === 'function') calculateCost();

  // Visual feedback on the button itself immediately
  if (btnElement) {
    btnElement.textContent = 'Selected';
    btnElement.classList.add('selected');
    btnElement.classList.remove('btn-choose-plan-default');
  }
};



// Global Admin Mode Handler (Moved to top to avoid closure trapping)
// Global Admin Mode Handler (Moved to top to avoid closure trapping)
window.checkAdminMode = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const isAdminMode = urlParams.get('admin_mode');
  const sessionId = urlParams.get('session_id');
  const pdfType = urlParams.get('pdf_type'); // 'admin' or 'client' (or null)



  if (isAdminMode && sessionId) {
    try {
      // FIX: Use relative path to avoid hardcoded 'new2' or 'cost-estimator' dependency
      // Assuming app.js is loaded in index.php at root
      const fetchUrl = `assets/api/retrieve_session.php?session_id=${sessionId}`;
      // console.log('Fetching session...', fetchUrl);
      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();

      // console.log(`Data success: ${result.success}`);

      if (result.success && result.data) {
        window.surveyResponses = result.data.surveyResponses || {};
        window.surveyResponses.selectedRooms = result.data.selectedRooms || {};
        window.surveyResponses.projectType = result.data.clientDetails?.projectType || 'Home Interior';

        // --- FIX: Hydrate Architecture Details for PDF ---
        if (result.data.costEstimate && result.data.costEstimate.architecture_details) {
          try {
            let arch = result.data.costEstimate.architecture_details;
            // If it's a string, parse it. If it's already an object (PHP might double encode or not), handle carefully.
            // Since DB saves as JSON, PHP fetch PDO::FETCH_ASSOC returns it as string (mysql) unless native types used.
            if (typeof arch === 'string') arch = JSON.parse(arch);
            window.surveyResponses.architectureDetails = arch;
          } catch (e) {
            console.warn("Failed to parse architecture_details in Admin Mode", e);
          }
        }
        // -------------------------------------------------

        // Load room features using global API
        // FIX: Use relative path
        window.roomFeaturesPromise = fetch('assets/api/getRoomFeatures.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            selectedRooms: result.data.selectedRooms || {},
            selectedCategory: result.data.selectedCategory || 'Standard',
            selectedStyles: result.data.selectedStyle ? [result.data.selectedStyle] : [],
            projectType: result.data.clientDetails?.projectType || 'Home Interior'
          })
        }).then(r => r.json()).then(d => {
          if (d.success && d.roomFeatures) {
            // Fix 1: Use correct key 'roomFeatures'
            // Fix 2: Map correct category column to 'description'
            const cat = (result.data.selectedCategory || 'Standard').toLowerCase() + '_cat'; // e.g. standard_cat

            // Iterate deeply to add .description
            Object.values(d.roomFeatures).forEach(room => {
              if (room.features) {
                room.features.forEach(f => {
                  f.description = f[cat] || f['standard_cat'] || '';
                });
              }
            });
            return d.roomFeatures;
          }
          return {};
        }).catch(e => ({}));

        window.estimateData = {
          clientDetails: result.data.clientDetails,
          costBreakdown: {
            final_project_cost: result.data.costEstimate?.total_estimate_cost || 0,
            areaCalculations: {
              // FIXED: Load from database instead of hardcoding to 0
              total_room_area: result.data.costEstimate?.total_room_area || 0
            }
          },
          designPreferences: { selectedStyle: result.data.selectedStyle, selectedCategory: result.data.selectedCategory }
        };

        // Update DOM elements if they exist
        // Update Text Helpers
        const updateText = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.textContent = val;
        };

        updateText('summaryProjectType', result.data.clientDetails?.projectType || 'Home Interior');
        updateText('totalAmountToPay', '₹' + (result.data.costEstimate?.total_estimate_cost || 0));
        if (document.getElementById('totalServiceCost')) document.getElementById('totalServiceCost').textContent = '₹' + (result.data.costEstimate?.service_cost || 0);
        // Only update chosenOffer from server if user hasn't locally selected one
        const chosenOfferEl = document.getElementById('chosenOffer');
        const localSelected = window.chosenOfferName || localStorage.getItem('selected_offer_backup');
        if (chosenOfferEl) {
          if (localSelected) {
            chosenOfferEl.textContent = localSelected;
          } else if (result.data.selectedOffer) {
            chosenOfferEl.textContent = result.data.selectedOffer;
          }
        }

        updateText('summaryStyle', result.data.selectedStyle || 'Modern Minimalist');
        updateText('summaryDesignCategory', result.data.selectedCategory || 'Standard');

        // Calculate rooms and area
        const roomCount = Object.values(result.data.selectedRooms || {}).reduce((a, b) => a + b, 0);
        updateText('summaryNumRooms', roomCount);

        // Calculate total area from JSON strings
        let totalArea = 0;
        try {
          const areaJson = result.data.costEstimate?.user_carpet_area || result.data.costEstimate?.std_carpet_area;

          // Debug: Check if areaJson is valid/useful
          let usedJson = false;
          if (areaJson) {
            const areaObj = typeof areaJson === 'string' ? JSON.parse(areaJson) : areaJson;
            // Check if values are all null/0
            const values = Object.values(areaObj);
            const hasData = values.some(v => v && Number(v) > 0);

            if (hasData) {
              values.forEach(val => {
                const num = Array.isArray(val) ? (val[0] || 0) : (val || 0);
                totalArea += Number(num);
              });
              usedJson = true;
            }
          }

          // Fallback: If area is 0, use Standard Defaults (Office Interior Heuristic)
          if (totalArea === 0 && window.surveyResponses.selectedRooms) {
            const fallbackSizes = {
              "Training Room": 200,
              "Collaboration Zones": 500,
              "Printing/Copy Room": 100,
              "Power Backup Room": 100,
              "Dining Room": 160,
              "Passage/Lobby/Corridor": 60,
              "Master Bedroom": 200,
              "Kids'/Children's Bedroom": 125,
              "Kitchen": 100,
              "Living Room": 250
            };

            Object.keys(window.surveyResponses.selectedRooms).forEach(room => {
              if (window.surveyResponses.selectedRooms[room] > 0) {
                const size = fallbackSizes[room] || 100; // Default 100 if unknown
                totalArea += (size * window.surveyResponses.selectedRooms[room]);
              }
            });
          }

        } catch (e) { console.error('Area Calc Error', e); }

        updateText('summaryCarpetArea', totalArea + ' sqft');
        updateText('summaryCost', 'Rs.' + (result.data.costEstimate?.total_estimate_cost || 0) + '/-');

        // --- Hydrate Services ---
        try {
          const city = result.data.clientDetails?.city || 'Pune';
          // FIX: Use relative path
          const sRes = await fetch(`assets/api/getServicesByCity.php?city=${encodeURIComponent(city)}`);
          const sData = await sRes.json();

          if (sData.success && sData.services) {
            const sMap = {};
            sData.services.forEach(s => sMap[s.service_id] = s);

            const selStr = result.data.costEstimate?.selected_services || '';
            const selIds = Array.isArray(selStr)
              ? selStr
              : (selStr.toString().split(',').map(s => s.trim()));

            let sList = document.getElementById('servicesOrderedList');
            if (!sList) {
              const cont = document.getElementById('servicesAccordionContent');
              if (cont) {
                sList = document.createElement('ul');
                sList.id = 'servicesOrderedList';
                sList.className = 'services-list';
                cont.appendChild(sList);
              }
            }

            if (sList) {
              sList.innerHTML = '';
              selIds.forEach(id => {
                const s = sMap[id];
                if (s) {
                  const li = document.createElement('li');
                  // Fix: Override 'Cost Report' -> 'First Site Visit' if mismatch occurs
                  let displayName = s.name;
                  if (displayName === 'Cost Report') displayName = 'First Site Visit';

                  const price = s.price || '0';
                  li.textContent = `${displayName} - ₹${price} /-`;
                  sList.appendChild(li);
                }
              });
            }
          }
        } catch (e) { console.error(`Service Error: ${e.message}`); }

        // --- Hydrate Offers ---
        try {
          let oName = result.data.selectedOffer || '';
          const match = oName.match(/\(Services \+ (.*)\)/);
          if (match && match[1]) oName = match[1].trim();

          let oList = document.getElementById('offerServicesOrderedList');
          if (!oList) {
            const cont = document.getElementById('offerServicesAccordionContent');
            if (cont) {
              oList = document.createElement('ul');
              oList.id = 'offerServicesOrderedList';
              cont.appendChild(oList);
            }
          }

          let selectedOffer = null;
          if (window.currentDiscountOffers) {
            selectedOffer = window.currentDiscountOffers.find(o => o.offer_name === oName);
            if (!selectedOffer) {
              const lo = oName.toLowerCase();
              selectedOffer = window.currentDiscountOffers.find(o => {
                const offerLo = o.offer_name.toLowerCase();
                return lo.includes(offerLo) || offerLo.includes(lo);
              });
            }
          }

          if (oList && selectedOffer && selectedOffer.details && selectedOffer.details.features) {
            oList.innerHTML = '';
            selectedOffer.details.features.forEach(f => {
              const li = document.createElement('li');
              li.textContent = f;
              oList.appendChild(li);
            });
          }
        } catch (e) { console.error(`Offer Error: ${e.message}`); }

        // Trigger PDF
        // Trigger PDF (Attempt Auto-Download)
        setTimeout(() => {
          const includeHiddenCosts = (pdfType === 'admin');
          if (typeof generatePDF === 'function') {
            // console.log('Auto-triggering PDF...');
            generatePDF(0, includeHiddenCosts);
          } else {
            console.error('generatePDF missing! Manual click required.');
          }
        }, 2500);

      } else {
        console.warn('Result not success or no data found in session.');
      }

    } catch (e) {
      console.error(`CRITICAL ERROR: ${e.message}`);
      // Only alert if it's a real crash
      alert('Admin Mode Error: ' + e.message);
    }
  } else {
    // console.log('Not Admin Mode or No Session');
  }
};

// Auto-init for Admin
if (window.location.search.includes('admin_mode=1')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.checkAdminMode);
  } else {
    window.checkAdminMode();
  }
}

const steps = [
  'Survey',            // arrow-section
  'Project Type',      // prj-type-sel-section
  'Room Config',       // room-config-section
  'Design Style',      // Design_Style
  'Category',          // design_categories
  'Contact'            // qform-alt
];
let currentStep = 0; // Start from the beginning



let selectedFloor = window.surveyResponses?.selectedFloor || null;
let selectedPreconstruction = window.surveyResponses?.selectedPreconstruction || [];

const houseArchitectureSection = document.getElementById("house_architecture_section");
const fdiv = document.getElementById("fdiv");
const pdiv = document.getElementById("pdiv");
fdiv

// Show/Hide section based on project type
function toggleHouseArchitectureSection() {
  if (window.surveyResponses.projectType && window.surveyResponses.projectType.trim().includes("House Architecture")) {
    houseArchitectureSection.style.display = "block";
    fdiv.style.display = "flex";
    pdiv.style.display = "flex";
    // console.log(pdiv.style.display);

    restoreFloorPreconSelections(); // restore saved selection states
  } else {
    houseArchitectureSection.style.display = "none";
    fdiv.style.display = "none";
    pdiv.style.display = "none";
    // console.log(pdiv.style.display);
    resetSelections();
  }
}

/* LEGACY CODE - Disabled to prevent conflict with Force Fix at bottom of file
// FLOOR selection (single)
document.querySelectorAll('.floor-option').forEach(box => {
  box.addEventListener('click', function () {
    document.querySelectorAll('.floor-option').forEach(el => el.classList.remove('active'));
    this.classList.add('active');
    selectedFloor = this.dataset.value;
    window.surveyResponses.selectedFloor = selectedFloor;
    document.getElementById('floor_type').value = selectedFloor;
    saveSurveyResponsesToLocalStorage();
  });
});

// PRE-CONSTRUCTION selection (multi)
document.querySelectorAll('.precon-option').forEach(box => {
  box.addEventListener('click', function () {
    const value = this.dataset.value;
    if (this.classList.contains('active')) {
      this.classList.remove('active');
      selectedPreconstruction = selectedPreconstruction.filter(v => v !== value);
    } else {
      this.classList.add('active');
      selectedPreconstruction.push(value);
    }
    window.surveyResponses.selectedPreconstruction = selectedPreconstruction;
    document.getElementById('preconstruction_items').value = selectedPreconstruction.join(',');
    saveSurveyResponsesToLocalStorage();
  });
});
*/

function resetSelections() {
  document.querySelectorAll('.option-box').forEach(el => el.classList.remove('active'));
  selectedFloor = null;
  selectedPreconstruction = [];
  window.surveyResponses.selectedFloor = null;
  window.surveyResponses.selectedPreconstruction = [];
  document.getElementById('floor_type').value = '';
  document.getElementById('preconstruction_items').value = '';
  saveSurveyResponsesToLocalStorage();
}

function restoreFloorPreconSelections() {
  if (selectedFloor) {
    const floorEl = document.querySelector(`.floor-option[data-value="${selectedFloor}"]`);
    if (floorEl) floorEl.classList.add('active');
  }
  if (Array.isArray(selectedPreconstruction)) {
    selectedPreconstruction.forEach(val => {
      const preEl = document.querySelector(`.precon-option[data-value="${val}"]`);
      if (preEl) preEl.classList.add('active');
    });
  }
}


// --- Progress Step Advance Function ---
function advanceStep() {
  currentStep = Math.min(currentStep + 1, steps.length - 1);
  renderHorizontalProgressBar();
  renderCircularProgressBar();
}

// --- Set Progress Step by Section ---
function setStepBySection(sectionId) {
  const sectionToStep = {
    'arrow-section': 0,
    'prj-type-sel-section': 1,
    'room-config-section': 2,
    'Design_Style': 3,
    'design_categories': 4,
    'qform-alt': 5,
    'service_section': 6
  };
  if (sectionToStep.hasOwnProperty(sectionId)) {
    currentStep = sectionToStep[sectionId];
    renderHorizontalProgressBar();
    renderCircularProgressBar();
  }
}

// --- Render Horizontal Progress Bar ---
function renderHorizontalProgressBar() {
  const container = document.querySelector('.progress-bar-horizontal');
  if (!container) return;
  container.innerHTML = '';
  const sectionIds = [
    'arrow-section',
    'prj-type-sel-section',
    'room-config-section',
    'Design_Style',
    'design_categories',
    'qform-alt'
  ];
  steps.forEach((step, idx) => {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'progress-step' + (idx < currentStep ? ' completed' : idx === currentStep ? ' active' : '');
    // Circle
    const circle = document.createElement('div');
    circle.className = 'progress-circle';
    if (currentStep >= steps.length - 1 && window.isContactFormSubmitted) {
      // All steps completed and form submitted: show checkmark for all
      circle.innerHTML = '✔';
    } else if (currentStep >= steps.length - 1) {
      // At last step but form not submitted: show number instead of checkmark
      circle.innerHTML = idx < currentStep ? '✔' : (idx === currentStep ? (idx + 1) : (idx + 1));
    } else {
      circle.innerHTML = idx < currentStep ? '✔' : (idx === currentStep ? (idx + 1) : (idx + 1));
    }
    // // Add click handler to scroll to section
    // if (sectionIds[idx]) {
    //   circle.style.cursor = 'pointer';
    //   circle.addEventListener('click', function () {
    //     const section = document.getElementById(sectionIds[idx]);
    //     if (section) {
    //       const yOffset = (typeof getDynamicScrollOffset === 'function') ? getDynamicScrollOffset() : 0;
    //       const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
    //       window.scrollTo({ top: y, behavior: 'smooth' });
    //       setStepBySection(sectionIds[idx]);
    //     }
    //   });
    // }
    stepDiv.appendChild(circle);
    // Line
    if (idx < steps.length - 1) {
      const line = document.createElement('div');
      line.className = 'progress-line';
      stepDiv.appendChild(line);
    }
    container.appendChild(stepDiv);
  });
}

// --- Render Circular Progress Bar ---
function renderCircularProgressBar() {
  const container = document.querySelector('.progress-bar-circular');
  if (!container) return;
  // Start at 0%, 100% only when contact form is submitted
  let percent;
  if (currentStep === 0) {
    percent = 0;
  } else if (currentStep >= steps.length - 1 && window.isContactFormSubmitted) {
    percent = 100;
  } else if (currentStep >= steps.length - 1) {
    // At last step but form not submitted - show 90%
    percent = 90;
  } else {
    percent = Math.round((currentStep / (steps.length - 1)) * 90);
  }
  const radius = 20;
  const stroke = 5;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - percent / 100);
  container.innerHTML = `
    <svg>
      <circle cx="25" cy="25" r="${radius}" stroke="#e0e0e0" stroke-width="${stroke}" fill="none" />
      <circle cx="25" cy="25" r="${radius}" stroke="#000000" stroke-width="${stroke}" fill="none" stroke-dasharray="${circ}" stroke-dashoffset="${offset}" />
    </svg>
    <div class="progress-text" style="color: #000000;">${percent}%</div>
  `;
}

// Function to control progress bar clickability
function setProgressBarClickable(clickable) {
  const circularProgress = document.querySelector('.progress-bar-circular');
  const horizontalProgress = document.querySelector('.progress-bar-horizontal');

  if (circularProgress) {
    circularProgress.style.pointerEvents = clickable ? 'auto' : 'none';
    circularProgress.style.opacity = clickable ? '1' : '0.5';
  }

  if (horizontalProgress) {
    horizontalProgress.style.pointerEvents = clickable ? 'auto' : 'none';
    horizontalProgress.style.opacity = clickable ? '1' : '0.5';
  }
}

// --- Initial Render ---
renderHorizontalProgressBar();
renderCircularProgressBar();

// Add this near the top, with your questions array
const chatBubbleMessages = [
  "This helps us tailor the design plan to fit your project's scope.",
  "This helps us align the plan with your preferred timeline.",
  "Whether hands-on or hands-off, your involvement guides how we collaborate.",
  "Your vision guides us. We'll seamlessly integrate any specific features or elements to reflect your style.",
  "This helps us deliver a personalized experience for you."
];

// Function to update step counter
function updateStepCounter() {
  const currentStepElement = document.getElementById('current-step');
  const totalStepsElement = document.getElementById('total-steps');

  if (currentStepElement && totalStepsElement) {
    currentStepElement.textContent = currentPage + 1;
    totalStepsElement.textContent = questions.length;
  }
}

// arrow section main content


// Now define renderCurrentQuestion properly
function renderCurrentQuestion() {
  if (questions.length === 0) return;

  // Update step counter
  updateStepCounter();

  const q = questions[currentPage];
  const avatarUrl = 'https://alacritys.in/wp-content/uploads/2025/07/Profile-Photo-YouTube-Post-2-1.png';
  const escapeHtml = (unsafe) => unsafe.replace(/[&<"'>]/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#039;' }[m]); });
  const questionText = escapeHtml(q.main || '');

  mainText.innerHTML = `<h2 class="question-plain"></h2><span class="question-arrow">⬇</span>`;
  const plainText = mainText.querySelector('.question-plain');
  plainText.textContent = questionText;

  // Call toggleInfoBox to update visibility
  if (typeof window.toggleInfoBox === 'function') {
    window.toggleInfoBox();
  }

  subText.innerHTML = '';
  const savedResponse = window.surveyResponses['q' + (currentPage + 1)];
  if (Array.isArray(q.options)) {
    // Clear existing options
    subText.innerHTML = '<div class="survey-options"></div>';
    const optionsContainer = subText.querySelector('.survey-options');

    q.options.forEach((opt, i) => {
      const selectedClass = savedResponse === opt ? 'selected' : '';

      optionsContainer.innerHTML += `
            <div class="option ${selectedClass}" data-value="${opt}">
                <span class="option-text">${opt}</span>
            </div>
        `;
    });
  } else {
    subText.textContent = 'No options available.';
  }
  // Append chat bubble message in its own container (not inside sub)
  const chatBubbleContainer = document.getElementById('chatBubbleContainer');
  if (chatBubbleContainer) {
    const chatMsg = chatBubbleMessages[currentPage] || '';
    if (chatMsg) {
      chatBubbleContainer.innerHTML = `
        <div class="bubble-row"">
          <img src="${avatarUrl}" alt="avatar" class="avatar-img">
          <div class="bubble-speech"">${chatMsg}</div>
        </div>
      `;
    } else {
      chatBubbleContainer.innerHTML = '';
    }
  }
  // Rotate the text container
  const textContainer = document.getElementById('textContainer');
  textContainer.style.transform = `rotate(${currentRotation}deg)`;
  renderSingleItem();
  setTimeout(() => {
    const options = subText.querySelectorAll('.option');
    options.forEach(option => {
      option.addEventListener('click', function () {
        // Remove selected class from all options
        const allOptions = subText.querySelectorAll('.option');
        allOptions.forEach(opt => opt.classList.remove('selected'));

        // Add selected class to the clicked option
        this.classList.add('selected');

        window.surveyManuallyChanged = true;
        window.surveyResponses['q' + (currentPage + 1)] = this.dataset.value;

        // Interaction detected: Hide initial tooltip
        if (typeof window.hideInitialTooltip === 'function') {
          window.hideInitialTooltip();
          // Re-eval step box visibility (it should appear now)
          if (typeof window.toggleInfoBox === 'function') window.toggleInfoBox();
        }

        // console.log('Updated survey responses:', window.surveyResponses);
        saveSurveyResponsesToLocalStorage();
        // Auto-advance to next question if not last
        if (currentPage < questions.length - 1) {
          currentPage++;
          currentRotation += 360;
          renderCurrentQuestion();
        } else if (currentPage === questions.length - 1) {
          // All questions answered, scroll to 'Select Project Type' section
          const prjTypeSelSection = document.getElementById('prj-type-sel-section');
          if (prjTypeSelSection) {
            prjTypeSelSection.scrollIntoView({ behavior: 'smooth' });
          }
          setStepBySection('prj-type-sel-section');
        }
      });
    });
  }, 0);

  // Restore selected state for previously answered questions
  setTimeout(() => {
    const savedResponse = window.surveyResponses['q' + (currentPage + 1)];
    if (savedResponse) {
      const selectedOption = subText.querySelector(`.option[data-value="${savedResponse}"]`);
      if (selectedOption) {
        selectedOption.classList.add('selected');
      }
    }
  }, 100);
}



function turnWheel(backwards = false) {
  if (isAnimating) return; // Block if animating
  if (questions.length === 0) return;

  if (!backwards) {
    // Only allow next if an option is selected for this question
    const selected = document.querySelector('.option.selected');
    if (!selected) {
      showQuestionWarning();
      return;
    } else {
      hideQuestionWarning();
    }

    if (currentPage < questions.length - 1) {
      currentPage++;
      renderCurrentQuestion();
    } else if (currentPage === questions.length - 1) {
      // All questions answered, scroll to 'Select Project Type' section
      const prjTypeSelSection = document.getElementById('prj-type-sel-section');
      if (prjTypeSelSection) {
        prjTypeSelSection.scrollIntoView({ behavior: 'smooth' });
      }
      setStepBySection('prj-type-sel-section');
    }

  } else {
    hideQuestionWarning();
    if (currentPage > 0) {
      currentPage--;
      renderCurrentQuestion();
    }
  }
}


// function checkInput(event) {
//   if (event.keyCode === 37) {
//     turnWheel(true);
//   } else if (event.keyCode === 39) {
//     turnWheel();
//   }
// }

let allInteriorTypes = [];
let selectedInteriorTypeId = null;



// project type section
// const wellnessAreas = [
//   "Spiritual",
//   "Occupational",
//   "Emotional",
//   "Environmental",
//   "Intellectual",
//   "Social",
//   "Physical"
// ];

// const menu = document.getElementById("circleMenu");
// const total = wellnessAreas.length;

// wellnessAreas.forEach((label, index) => {
//   const angle = (360 / total) * index;
//   const a = document.createElement("a");
//   a.href = "#";
//   a.textContent = label;
//   a.className = `color-${index % 7}`;
//   a.style.transform = `rotate(${angle}deg) translate(var(--radius)) rotate(-${angle}deg)`;
//   menu.appendChild(a);
// });

const mainText = document.querySelector("#main");
const subText = document.querySelector("#sub");
const leftArrow = document.querySelector("#left");
const rightArrow = document.querySelector("#right");

let questions = [];
let currentPage = 0;
let currentRotation = 0; // Cumulative angle in degrees

// Unify surveyResponses as a single global object
// Unify surveyResponses as a single global object
window.surveyResponses = {};
// Try to restore immediately on load to prevent data loss
try {
  const storedInit = localStorage.getItem('surveyResponses');
  if (storedInit) {
    const parsedInit = JSON.parse(storedInit);
    const actualData = parsedInit.value || parsedInit;
    if (actualData && typeof actualData === 'object') {
      window.surveyResponses = actualData;
      // console.log("Initialized surveyResponses from localStorage", window.surveyResponses);
    }
  }
} catch (e) { console.error("Error init surveyResponses", e); }
let isAnimating = false;

// --- INFO SECTIONS LOGIC (Redefined safely after variable init) ---
window.hideInitialTooltip = function () {
  // Logic removed as initial-tooltip is deleted
  toggleInfoBox();
};

window.toggleInfoBox = function () {
  const stepBox = document.getElementById('step-info-box');

  if (stepBox) {
    stepBox.style.display = 'block';
    stepBox.classList.remove('step-box-hidden');
    stepBox.classList.add('step-box-visible');
  }
};

// --- INFO SECTIONS LOGIC END --- // Add at the top, after let surveyResponses = {};

function showToast(message) {
  let toast = document.querySelector('.custom-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'custom-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function showQuestionWarning() {
  showToast('Please select an option before proceeding.');
}

function hideQuestionWarning() {
  // No-op for toast version
}



function renderSingleItem() {
  // Only update the number, do not set position
  const item = document.querySelector('.item');
  if (item) {
    item.textContent = currentPage + 1;
  }
}



// room config section
function renderRoomConfig(interiorType) {
  const container = document.getElementById('roomConfigContainer');
  if (!container) return;

  if (!interiorType) return;

  // --- FIX: Hardcode House Architecture Rooms if missing (Data Rescue) ---
  if (interiorType.name === 'House Architecture' || interiorType.id == 3) {
    if (!interiorType.rooms || interiorType.rooms.length === 0) {
      // console.log("Injecting Hardcoded House Architecture Rooms");
      interiorType.rooms = [
        { room_id: 901, room_type: 'Compound Wall' },
        { room_id: 902, room_type: 'Terrace' },
        { room_id: 903, room_type: 'Main Gate' },
        { room_id: 904, room_type: 'Entrance Lobby' },
        { room_id: 905, room_type: 'Living Room' },
        { room_id: 906, room_type: 'Dining Room' },
        { room_id: 907, room_type: 'Kitchen' },
        { room_id: 908, room_type: 'Bedrooms' }
      ];
    }
  }
  // ----------------------------------------------------

  if (!Array.isArray(interiorType.rooms) || interiorType.rooms.length === 0) {
    container.innerHTML = '<div style="text-align:center; color:#888; font-size:1.2em;">No rooms available for this type.</div>';
    // Show the down arrow button
    const arrowBtn = document.getElementById('roomConfigDownArrow');
    if (arrowBtn) {
      arrowBtn.style.display = '';
    }
    return;
  }

  container.innerHTML = `
        <div class="room-config-grid">
            ${interiorType.rooms.map(room => `
                <div class="room-config-item sr-room-item">
                    <label class="room-checkbox-label">
                        <input type="checkbox" class="room-checkbox" id="room_${room.room_id}">
                        <span>${room.room_type}</span>
                    </label>
                    <div class="room-counter" id="counter_${room.room_id}" style="display:none;">
                        <button class="counter-btn minus" data-room="${room.room_id}">-</button>
                        <span class="room-count" id="count_${room.room_id}">1</span>
                        <button class="counter-btn plus" data-room="${room.room_id}">+</button>
                    </div>
                    <div class="carpet-area-inputs" id="carpet_${room.room_id}" style="display:none;">
                        <!-- Carpet area inputs will be dynamically generated here -->
                    </div>
                </div>
            `).join('')}
        </div>
    `;

  // Function to generate carpet area inputs based on room count
  const generateCarpetAreaInputs = (roomId, roomLabel, count) => {
    const carpetContainer = document.getElementById('carpet_' + roomId);
    if (!carpetContainer) return;

    let inputsHtml = '<div class="carpet-area-header">Carpet Area <span class="carpet-area-optional">(Optional)</span>:</div>';
    for (let i = 1; i <= count; i++) {
      // Get ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
      const getOrdinalSuffix = (num) => {
        if (num === 1) return '1st';
        if (num === 2) return '2nd';
        if (num === 3) return '3rd';
        return num + 'th';
      };

      // For first input when count = 1, use empty placeholder
      // For all other cases, use full room name (no word cutting)
      let placeholder = '';
      if (count === 1 && i === 1) {
        placeholder = ''; // Empty placeholder for first input when count = 1
      } else {
        placeholder = `${getOrdinalSuffix(i)} ${roomLabel} (optional)`; // Full room name
      }

      inputsHtml += `
        <div class="carpet-input-row">
          <input type="number"
                 class="carpet-area-input"
                 id="carpet_${roomId}_${i}"
                 placeholder="${placeholder}"
                 min="1"
                 step="1">
          <span class="carpet-unit">sq ft</span>
        </div>
      `;
    }
    carpetContainer.innerHTML = inputsHtml;
    carpetContainer.style.display = 'block';

    // Add event listeners to carpet area inputs
    for (let i = 1; i <= count; i++) {
      const input = document.getElementById(`carpet_${roomId}_${i}`);
      if (input) {
        input.addEventListener('input', updateSelectedRoomsInSurveyResponses);
      }
    }
  };

  // Helper to update selected rooms in surveyResponses
  const updateSelectedRoomsInSurveyResponses = () => {
    const selectedRooms = {};
    const carpetAreas = {};

    container.querySelectorAll('.room-checkbox').forEach(checkbox => {
      if (checkbox.checked) {
        const roomId = checkbox.id.replace('room_', '');
        const roomLabel = checkbox.parentElement.querySelector('span').textContent.trim();
        const count = parseInt(document.getElementById('count_' + roomId).textContent, 10);
        selectedRooms[roomLabel] = count;

        // Collect carpet area values
        const roomCarpetAreas = [];
        for (let i = 1; i <= count; i++) {
          const carpetInput = document.getElementById(`carpet_${roomId}_${i}`);
          if (carpetInput && carpetInput.value) {
            roomCarpetAreas.push(parseInt(carpetInput.value) || 0);
          }
        }
        if (roomCarpetAreas.length > 0) {
          carpetAreas[roomLabel] = roomCarpetAreas;
        }
      }
    });

    // Store as object property
    window.surveyResponses.selectedRooms = selectedRooms;
    window.surveyResponses.carpetAreas = carpetAreas;
    saveSurveyResponsesToLocalStorage();
  };

  // Pre-fill checkboxes and counters from localStorage if available
  const selectedRoomsLS = window.surveyResponses.selectedRooms || {};
  interiorType.rooms.forEach(room => {
    const roomLabel = room.room_type;
    const roomId = room.room_id;
    if (selectedRoomsLS[roomLabel]) {
      const checkbox = container.querySelector(`#room_${roomId}`);
      const counterDiv = document.getElementById('counter_' + roomId);
      const countSpan = document.getElementById('count_' + roomId);
      if (checkbox) {
        checkbox.checked = true;
        if (counterDiv) counterDiv.style.display = '';
        if (countSpan) countSpan.textContent = selectedRoomsLS[roomLabel];

        // Also generate carpet area inputs for checked rooms
        const count = selectedRoomsLS[roomLabel];
        generateCarpetAreaInputs(roomId, roomLabel, count);

        // Restore carpet area values if they exist
        const savedCarpetAreas = window.surveyResponses.carpetAreas || {};
        if (savedCarpetAreas[roomLabel]) {
          savedCarpetAreas[roomLabel].forEach((value, index) => {
            const carpetInput = document.getElementById(`carpet_${roomId}_${index + 1}`);
            if (carpetInput && value) {
              carpetInput.value = value;
            }
          });
        }
      }
    }
  });

  // Add event listeners for plus/minus buttons
  container.querySelectorAll('.counter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const roomId = this.getAttribute('data-room');
      const countSpan = document.getElementById('count_' + roomId);
      const roomCheckbox = document.getElementById('room_' + roomId);
      const roomLabel = roomCheckbox.parentElement.querySelector('span').textContent.trim();

      let count = parseInt(countSpan.textContent, 10);
      if (this.classList.contains('minus')) {
        if (count > 1) count--;
      } else {
        count++;
      }
      countSpan.textContent = count;

      // Save existing carpet area values before regenerating
      const existingValues = [];
      if (roomCheckbox.checked) {
        for (let i = 1; i <= parseInt(countSpan.textContent, 10); i++) {
          const existingInput = document.getElementById(`carpet_${roomId}_${i}`);
          if (existingInput && existingInput.value) {
            existingValues.push(existingInput.value);
          }
        }
      }

      // Regenerate carpet area inputs with new count
      if (roomCheckbox.checked) {
        generateCarpetAreaInputs(roomId, roomLabel, count);

        // Restore existing values
        existingValues.forEach((value, index) => {
          if (index < count) { // Only restore if within new count limit
            const newInput = document.getElementById(`carpet_${roomId}_${index + 1}`);
            if (newInput) {
              newInput.value = value;
            }
          }
        });
      }

      updateSelectedRoomsInSurveyResponses();
    });
  });

  // Add event listeners for checkboxes to show/hide counter and arrow button
  const updateArrowButton = () => {
    const anyChecked = Array.from(container.querySelectorAll('.room-checkbox')).some(cb => cb.checked);
    const arrowBtn = document.getElementById('roomConfigDownArrow');
    if (!arrowBtn) return;
    arrowBtn.style.display = anyChecked ? '' : 'none';
  };
  container.querySelectorAll('.room-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const roomId = this.id.replace('room_', '');
      const roomLabel = this.parentElement.querySelector('span').textContent.trim();
      const counterDiv = document.getElementById('counter_' + roomId);
      const carpetDiv = document.getElementById('carpet_' + roomId);

      if (this.checked) {
        counterDiv.style.display = '';
        const count = parseInt(document.getElementById('count_' + roomId).textContent, 10);
        generateCarpetAreaInputs(roomId, roomLabel, count);

        // Only advance step if this is the first room selected
        if (Object.keys(window.surveyResponses.selectedRooms || {}).length === 0) {
          setStepBySection('room-config-section');
        }
      } else {
        counterDiv.style.display = 'none';
        carpetDiv.style.display = 'none';
        carpetDiv.innerHTML = '';
      }
      updateArrowButton();
      updateSelectedRoomsInSurveyResponses();

      // Populate dynamic compare section when rooms are updated
      populateDynamicCompareSection();

      // Also trigger the HTML function if available
      if (typeof updateCompareSectionRooms === 'function') {
        setTimeout(() => {
          updateCompareSectionRooms();
        }, 100);
      }
    });
  });
  // Initial check in case of pre-checked
  updateArrowButton();
  updateSelectedRoomsInSurveyResponses();
  // Hide arrow if section is out of view on scroll
  window.addEventListener('scroll', updateArrowButton);

  // Make the down arrow scroll to the next section when clicked
  const arrowBtn = document.getElementById('roomConfigDownArrow');
  if (arrowBtn) {
    arrowBtn.style.pointerEvents = 'auto'; // Make it clickable
    arrowBtn.addEventListener('click', function () {
      const nextSection = document.getElementById('Design_Style');
      if (nextSection) {
        nextSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
      setStepBySection('Design_Style');
    });
  }



  // Removed ScrollReveal for room-config-item to prevent opacity issues
}

let stylesData = []; // Will be populated from the server
let categoriesData = []; // Will be populated from the server


// Helper function for dynamic scroll offset based on screen size
// function getDynamicScrollOffset() {
//   if (window.innerWidth <= 480) {
//     return -20; // Small mobile screens
//   } else if (window.innerWidth <= 768) {
//     return -30; // Medium mobile screens
//   } else if (window.innerWidth <= 1024) {
//     return -40; // Tablet screens
//   } else {
//     return -50; // Desktop screens
//   }
// }

// Design Style section
document.addEventListener('DOMContentLoaded', function () {
  // Get navigation items for both mobile and desktop
  const mobileItems = document.querySelectorAll('#mobileNav .dsg-nav-item');
  const desktopItems = document.querySelectorAll('#desktopNav .dsg-nav-item');
  const sections = document.querySelectorAll('#Design_Style .dsg-content-section');

  // Function to handle navigation clicks
  function handleNavigationClick(item, allItems) {
    const targetId = item.getAttribute('data-target');

    // Update active state for all items (both mobile and desktop)
    mobileItems.forEach(i => i.classList.remove('active'));
    desktopItems.forEach(i => i.classList.remove('active'));

    // Find corresponding items and activate them
    const mobileItem = document.querySelector(`#mobileNav .dsg-nav-item[data-target="${targetId}"]`);
    const desktopItem = document.querySelector(`#desktopNav .dsg-nav-item[data-target="${targetId}"]`);

    if (mobileItem) mobileItem.classList.add('active');
    if (desktopItem) desktopItem.classList.add('active');

    // Scroll to section for both mobile and desktop
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      // Scroll to target section
      targetSection.scrollIntoView({
        behavior: 'smooth',
        // block: 'start'
      });
    }
  }

  // Add click handlers for mobile navigation
  mobileItems.forEach(item => {
    item.addEventListener('click', function () {
      handleNavigationClick(this, mobileItems);
    });
  });

  // Add click handlers for desktop navigation
  desktopItems.forEach(item => {
    item.addEventListener('click', function () {
      handleNavigationClick(this, desktopItems);
    });
  });

  // Scroll detection for navigation sync - activate nav for currently visible section
  window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('#Design_Style .dsg-content-section');

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;

      if (isVisible) {
        const currentSectionId = section.getAttribute('id');

        // Update both mobile and desktop navigation active state
        mobileItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('data-target') === currentSectionId) {
            item.classList.add('active');
          }
        });

        desktopItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('data-target') === currentSectionId) {
            item.classList.add('active');
          }
        });
      }
    });
  });

  // Scroll down button functionality
  const scrollDownBtn = document.getElementById('designStyleDownArrow');
  if (scrollDownBtn) {
    // Hide button initially
    scrollDownBtn.style.display = 'none';

    scrollDownBtn.addEventListener('click', function () {
      const designCategoriesSection = document.getElementById('design_categories');
      if (designCategoriesSection) {
        designCategoriesSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  }

  // Function to show/hide down arrow based on selection
  function updateDesignStyleDownArrow() {
    const scrollDownBtn = document.getElementById('designStyleDownArrow');
    if (scrollDownBtn) {
      const selectedStyles = window.surveyResponses?.selectedStyles;
      const hasSelection = selectedStyles && selectedStyles.length > 0;

      scrollDownBtn.style.display = hasSelection ? 'block' : 'none';
    }
  }

  // Radio button functionality for design style selection
  function setupDesignStyleSelection() {
    const contentSections = document.querySelectorAll('#Design_Style .dsg-content-section');

    // Create invisible radio buttons for each section
    contentSections.forEach((section, index) => {
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'designStyle';
      radio.id = `designStyle${index}`;
      radio.style.display = 'none';
      section.appendChild(radio);

      // Add click handler to section
      section.addEventListener('click', function () {
        // Check if rooms are selected first
        const selectedRooms = window.surveyResponses?.selectedRooms || {};
        if (Object.keys(selectedRooms).length === 0) {
          showToast('Please select at least one room first before choosing a design style.');
          // Scroll to room config section if visible, otherwise to project type section
          const roomConfigSection = document.getElementById('room-config-section');
          const prjTypeSection = document.getElementById('prj-type-sel-section');

          if (roomConfigSection && roomConfigSection.style.display !== 'none') {
            roomConfigSection.scrollIntoView({ behavior: 'smooth' });
          } else if (prjTypeSection) {
            prjTypeSection.scrollIntoView({ behavior: 'smooth' });
          }
          return;
        }

        // Uncheck all radios and remove styling
        contentSections.forEach(s => {
          s.querySelector('input[type="radio"]').checked = false;
          s.classList.remove('selected');
        });

        // Remove selected class from all nav items
        mobileItems.forEach(item => item.classList.remove('selected'));
        desktopItems.forEach(item => item.classList.remove('selected'));

        // Check this radio and style the section
        radio.checked = true;
        section.classList.add('selected');

        // Update navigation active state
        const sectionId = section.getAttribute('id');
        const mobileItem = document.querySelector(`#mobileNav .dsg-nav-item[data-target="${sectionId}"]`);
        const desktopItem = document.querySelector(`#desktopNav .dsg-nav-item[data-target="${sectionId}"]`);

        // Remove active from all nav items
        // Remove active from all nav items
        mobileItems.forEach(item => item.classList.remove('active'));
        desktopItems.forEach(item => item.classList.remove('active'));

        if (mobileItem) {
          mobileItem.classList.add('active');
          mobileItem.classList.add('selected');
        }
        if (desktopItem) {
          desktopItem.classList.add('active');
          desktopItem.classList.add('selected');
        }

        // Allow selection of the same style (toggle behavior if needed, or just keep applied)
        // Store selected style in global object
        const selectedStyle = sectionId;

        // Reset all buttons text
        document.querySelectorAll('.select-style-btn').forEach(btn => {
          btn.textContent = 'Select This Style';
          btn.classList.remove('selected');
        });

        // Update current button text
        const currentBtn = section.querySelector('.select-style-btn');
        if (currentBtn) {
          currentBtn.textContent = 'Selected';
          currentBtn.classList.add('selected');
        }

        window.surveyResponses.selectedStyles = [selectedStyle];
        window.surveyResponses.selectedDesignStyle = selectedStyle; // Backward compatibility
        saveSurveyResponsesToLocalStorage();

        // Show down arrow
        updateDesignStyleDownArrow();
      });
    });

    // Add click handlers to the buttons specifically
    document.querySelectorAll('.select-style-btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent double triggering
        // Find parent section and trigger its click
        const section = this.closest('.dsg-content-section');
        if (section) {
          section.click();
        }
      });
    });

    // Restore selection from local storage
    const storedStyle = window.surveyResponses?.selectedStyles?.[0] || window.surveyResponses?.selectedDesignStyle;
    if (storedStyle) {
      const section = document.getElementById(storedStyle);
      if (section) {
        // We use a timeout to let other initializations finish
        setTimeout(() => {
          // Manually trigger visual update without scrolling or full click logic if preferred,
          // but clicking is safest to ensure all states sync.
          // However, we might want to avoid auto-scroll on load.
          // So let's just apply classes manually.

          contentSections.forEach(s => s.classList.remove('selected'));
          section.classList.add('selected');

          // Update button state
          document.querySelectorAll('.select-style-btn').forEach(b => {
            b.textContent = 'Select This Style';
            b.classList.remove('selected');
          });
          const btn = section.querySelector('.select-style-btn');
          if (btn) {
            btn.textContent = 'Selected';
            btn.classList.add('selected');
          }

          // Update radio
          const radio = section.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;

          updateDesignStyleDownArrow();

        }, 100);
      }
    }

  }



  // Initialize design style selection
  setupDesignStyleSelection();

  // Pre-select radio if selectedStyles is set in surveyResponses
  function restoreDesignStyleSelection() {
    const selectedStyles = window.surveyResponses?.selectedStyles;
    if (selectedStyles && selectedStyles.length > 0) {
      const contentSections = document.querySelectorAll('#Design_Style .dsg-content-section');

      contentSections.forEach((section, index) => {
        const sectionId = section.getAttribute('id');
        const radio = section.querySelector('input[type="radio"]');

        // Check if this section matches the selected style
        if (selectedStyles.includes(sectionId)) {
          // Check the radio and add selected styling
          if (radio) {
            radio.checked = true;
          }
          section.classList.add('selected');

          // Update navigation active state
          const mobileItem = document.querySelector(`#mobileNav .dsg-nav-item[data-target="${sectionId}"]`);
          const desktopItem = document.querySelector(`#desktopNav .dsg-nav-item[data-target="${sectionId}"]`);

          // Remove active from all nav items
          mobileItems.forEach(item => item.classList.remove('active'));
          desktopItems.forEach(item => item.classList.remove('active'));

          // Add active and selected to corresponding nav items
          if (mobileItem) {
            mobileItem.classList.add('active');
            mobileItem.classList.add('selected');
          }
          if (desktopItem) {
            desktopItem.classList.add('active');
            desktopItem.classList.add('selected');
          }
        }
      });
    }
  }

  // Call restore function after a short delay to ensure DOM is ready
  setTimeout(restoreDesignStyleSelection, 200);

  // Initialize down arrow state
  setTimeout(updateDesignStyleDownArrow, 300);

  // Call debug function
  // debugSections();

  // Make mobile navigation stick within desktop container bounds
  function handleMobileNavSticky() {
    const mobileTop = document.querySelector('.dsg-mobile-top');
    const desktopContainer = document.querySelector('.dsg-desktop-container');

    if (mobileTop && desktopContainer) {
      const desktopRect = desktopContainer.getBoundingClientRect();
      const mobileHeight = 300; // Approximate height of mobile nav

      if (desktopRect.top <= 20) {
        // Desktop container is at or above top of viewport
        if (desktopRect.bottom >= mobileHeight + 20) {
          // Enough space to stick to top
          mobileTop.style.position = 'fixed';
          mobileTop.style.top = '12vh';
        } else {
          // Not enough space - keep at bottom of container
          mobileTop.style.position = 'absolute';
          mobileTop.style.top = (desktopRect.height - mobileHeight - 10) + 'px';
        }
      } else {
        // Desktop container is below top of viewport
        mobileTop.style.position = 'absolute';
        mobileTop.style.top = '0px';
      }
    }
  }

  // Call on scroll
  window.addEventListener('scroll', handleMobileNavSticky);

  // Call on load
  handleMobileNavSticky();

  // Image Modal Functionality
  function setupImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');

    // Function to open modal
    function openModal(imageSrc) {
      modalImage.src = imageSrc;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    // Function to close modal
    function closeModal() {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto'; // Restore scrolling
    }

    // Add click handlers to all images
    const allImages = document.querySelectorAll('.dsg-desktop-hero img, .dsg-thumbnail img');
    allImages.forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openModal(this.src);
      });
    });

    // Close modal on close button click
    modalClose.addEventListener('click', closeModal);

    // Close modal on background click
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
      }
    });
  }

  // Initialize image modal
  setupImageModal();
});


document.addEventListener("DOMContentLoaded", async () => {
  // console.log('[DEBUG] DOMContentLoaded started');

  // CRITICAL: Always show initial tooltip on page load (removed localStorage check)
  // User will see "Your Project Estimate..." every time they refresh

  try {
    const res = await fetch('assets/api/getSurveyQuestion.php');
    // console.log('[DEBUG] Fetch response status:', res.status);
    const data = await res.json();
    // console.log('[DEBUG] Fetched data:', data);
    questions = data.questions;
    // console.log('[DEBUG] Questions array:', questions);

    // Store all interior types
    allInteriorTypes = data.interior_types || [];
    // console.log('[DEBUG] Interior types:', allInteriorTypes);
    // Do not select any type by default
    selectedInteriorTypeId = null;

    // Build the circle menu
    const menu = document.getElementById("circleMenu");
    menu.innerHTML = '';
    const n = allInteriorTypes.length;
    const baseHue = 0; // red
    const lightnessStart = 70; // less light, more visible
    const lightnessEnd = 10;   // darkest
    allInteriorTypes.forEach((type, index) => {
      const angle = (360 / n) * index + 270;
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = type.name;
      // Calculate lightness for this item (clockwise, light to dark)
      const lightness = lightnessStart - ((lightnessStart - lightnessEnd) * (index / (n - 1)));
      a.style.background = `hsl(${baseHue}, 80%, ${lightness}%)`;
      a.style.transform = `rotate(${angle}deg) translate(var(--radius)) rotate(-${angle}deg)`;
      a.dataset.typeId = type.id;
      menu.appendChild(a);
    });

    // Add click listeners to the menu
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        // Only allow if survey is complete
        if (currentPage < questions.length - 1) {
          showToast('Please complete the survey before selecting a project type.');
          // Scroll to the arrow section with larger offset
          const arrowSection = document.getElementById('arrow-section');
          if (arrowSection) {
            const yOffset = -100; // Increased offset for sticky header
            const y = arrowSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
          return;
        }
        selectedInteriorTypeId = Number(this.dataset.typeId);
        // Store project type NAME as a property
        const selectedType = allInteriorTypes.find(t => Number(t.id) === Number(selectedInteriorTypeId));
        window.surveyResponses.projectType = selectedType ? selectedType.name : '';
        // Log updated survey responses (project type selection)
        // console.log('Updated survey responses:', window.surveyResponses);
        saveSurveyResponsesToLocalStorage();
        // Update active class
        menu.querySelectorAll('a').forEach(el => el.classList.remove('active'));
        this.classList.add('active');
        // Render rooms for selected type
        renderRoomConfig(selectedType);
        // Show the room config section
        const roomConfigSection = document.getElementById('room-config-section');
        if (roomConfigSection) {
          roomConfigSection.style.display = 'block';
          // Dynamic scroll offset based on screen size
          // const yOffset = getDynamicScrollOffset();
          const y = roomConfigSection.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
        setStepBySection('room-config-section');


        toggleHouseArchitectureSection();


        const selectedInteriorTypeId2 = this.dataset.typeId;
        // console.log("getDesigns");
        // Fetch design styles dynamically after room is selected
        $.ajax({
          url: 'assets/api/getDesigns.php',
          type: 'POST',
          dataType: 'json',
          data: { projectType: selectedInteriorTypeId2 },
          success: function (response) {
            // console.log(response.styles);
            if (response.styles && Array.isArray(response.styles)) {
              updateVisibleDesignStyles(response.styles);
            } else {
              console.warn('No styles found in response');
            }
          },
          error: function (xhr, status, error) {
            console.error('Error fetching design styles:', error);
          }
        });




      });
    });


    // --- Restore survey progress from localStorage if present ---
    let lastAnswered = 0;
    let restoredProjectType = null;
    const item = localStorage.getItem('surveyResponses');
    if (item) {
      try {
        const data = JSON.parse(item);
        if (data.value) {
          for (let i = 1; i <= questions.length; i++) {
            if (data.value['q' + i]) lastAnswered = i;
          }
          if (data.value.projectType) {
            restoredProjectType = data.value.projectType;
          }
        }
      } catch (e) { }
    }

    if (lastAnswered > 0) {
      currentPage = lastAnswered - 1;
      currentRotation = 360 * (lastAnswered - 1);
      renderCurrentQuestion();
      currentStep = 0;
      renderHorizontalProgressBar();
      renderCircularProgressBar();

      // Check section completion status and navigate to appropriate section
      const selectedRoomsLS = window.surveyResponses.selectedRooms || {};
      const selectedStylesLS = window.surveyResponses.selectedStyles || [];
      const selectedDesignStyleLS = window.surveyResponses.selectedDesignStyle;
      const selectedCategoryLS = window.surveyResponses.selectedCategory;
      const selectedServicesLS = window.surveyResponses.selectedServices || [];
      const contactFieldsFilled = window.surveyResponses.firstName && window.surveyResponses.lastName && window.surveyResponses.email && window.surveyResponses.phone && window.surveyResponses.pincode;

      // If all questions are answered, check which section to show
      if (lastAnswered === questions.length) {
        // Check if project type is selected
        if (window.surveyResponses.projectType) {
          setStepBySection('prj-type-sel-section');

          // Check if rooms are selected
          if (Object.keys(selectedRoomsLS).length > 0) {
            // Check if styles are selected (check both selectedStyles array and selectedDesignStyle string)
            if ((Array.isArray(selectedStylesLS) && selectedStylesLS.length > 0) || selectedDesignStyleLS) {
              // Check if design category is selected
              if (selectedCategoryLS) {
                // Check if contact form is filled
                if (contactFieldsFilled) {
                  // All sections completed - show contact form
                  window.isContactFormSubmitted = true;
                  // Update progress bar to show 100%
                  renderCircularProgressBar();
                  renderHorizontalProgressBar();
                  setTimeout(() => {
                    const contactSection = document.getElementById('qform-alt');
                    if (contactSection) {
                      // const yOffset = getDynamicScrollOffset();
                      const y = contactSection.getBoundingClientRect().top + window.pageYOffset;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                      // Pre-fill contact form inputs
                      const firstNameInput = contactSection.querySelector('input[name="firstName"], #firstName');
                      const lastNameInput = contactSection.querySelector('input[name="lastName"], #lastName');
                      const emailInput = contactSection.querySelector('input[name="email"], #email');
                      const phoneInput = contactSection.querySelector('input[name="phone"], #phone');
                      const pincodeInput = contactSection.querySelector('input[name="pincode"], #pincode');
                      const companyInput = contactSection.querySelector('input[name="company"], #company');
                      const gstInput = contactSection.querySelector('input[name="gst"], #gst');

                      const whatsappInput = contactSection.querySelector('input[name="whatsapp"], #whatsapp');
                      if (firstNameInput && window.surveyResponses.firstName) firstNameInput.value = window.surveyResponses.firstName;
                      if (lastNameInput && window.surveyResponses.lastName) lastNameInput.value = window.surveyResponses.lastName;
                      if (emailInput && window.surveyResponses.email) emailInput.value = window.surveyResponses.email;
                      if (phoneInput && window.surveyResponses.phone) phoneInput.value = window.surveyResponses.phone;
                      if (pincodeInput && window.surveyResponses.pincode) pincodeInput.value = window.surveyResponses.pincode;
                      if (companyInput && window.surveyResponses.company) companyInput.value = window.surveyResponses.company;
                      if (gstInput && window.surveyResponses.gst) gstInput.value = window.surveyResponses.gst;

                      if (whatsappInput && typeof window.surveyResponses.whatsapp !== 'undefined') whatsappInput.checked = !!window.surveyResponses.whatsapp;
                    }
                    setStepBySection('qform-alt');
                  }, 100);
                } else {
                  // Contact form not filled - show contact form
                  setTimeout(() => {
                    const contactSection = document.getElementById('qform-alt');
                    if (contactSection) {
                      // const yOffset = getDynamicScrollOffset();
                      const y = contactSection.getBoundingClientRect().top + window.pageYOffset;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                      // Pre-fill contact form inputs if available
                      const firstNameInput = contactSection.querySelector('input[name="firstName"], #firstName');
                      const lastNameInput = contactSection.querySelector('input[name="lastName"], #lastName');
                      const emailInput = contactSection.querySelector('input[name="email"], #email');
                      const phoneInput = contactSection.querySelector('input[name="phone"], #phone');
                      const pincodeInput = contactSection.querySelector('input[name="pincode"], #pincode');
                      const companyInput = contactSection.querySelector('input[name="company"], #company');
                      const gstInput = contactSection.querySelector('input[name="gst"], #gst');

                      const whatsappInput = contactSection.querySelector('input[name="whatsapp"], #whatsapp');
                      if (firstNameInput && window.surveyResponses.firstName) firstNameInput.value = window.surveyResponses.firstName;
                      if (lastNameInput && window.surveyResponses.lastName) lastNameInput.value = window.surveyResponses.lastName;
                      if (emailInput && window.surveyResponses.email) emailInput.value = window.surveyResponses.email;
                      if (phoneInput && window.surveyResponses.phone) phoneInput.value = window.surveyResponses.phone;
                      if (pincodeInput && window.surveyResponses.pincode) pincodeInput.value = window.surveyResponses.pincode;
                      if (companyInput && window.surveyResponses.company) companyInput.value = window.surveyResponses.company;
                      if (gstInput && window.surveyResponses.gst) gstInput.value = window.surveyResponses.gst;

                      if (whatsappInput && typeof window.surveyResponses.whatsapp !== 'undefined') whatsappInput.checked = !!window.surveyResponses.whatsapp;
                    }
                    setStepBySection('qform-alt');
                  }, 100);
                }
              } else {
                // Design category not selected - show design categories section
                setTimeout(() => {
                  const designCategoriesSection = document.getElementById('design_categories');
                  if (designCategoriesSection) {
                    // const yOffset = getDynamicScrollOffset(); // Add extra top space
                    const y = designCategoriesSection.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                  setStepBySection('design_categories');
                }, 100);
              }
            } else {
              // Styles not selected - show Design_Style section
              setTimeout(() => {
                const designStyleSection = document.getElementById('Design_Style');
                if (designStyleSection) {
                  // const yOffset = getDynamicScrollOffset();
                  const y = designStyleSection.getBoundingClientRect().top + window.pageYOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
                setStepBySection('Design_Style');
              }, 100);
            }
          } else {
            // Rooms not selected - show room config section
            const roomConfigSection = document.getElementById('room-config-section');
            if (roomConfigSection) {
              roomConfigSection.style.display = 'block';
              setTimeout(() => {
                // const yOffset = getDynamicScrollOffset();
                const y = roomConfigSection.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }, 100);
            }
            setStepBySection('room-config-section');
          }
        } else {
          // Project type not selected - show project type selection
          setStepBySection('prj-type-sel-section');
        }

        // Highlight selected design_categories card if present
        if (selectedCategoryLS) {
          setTimeout(() => {
            const cards = document.querySelectorAll('#design_categories .slider-card, #design_categories .category-card');
            cards.forEach(card => {
              // For slider-card, check data-tier; for category-card, check h2 text
              const tier = card.getAttribute('data-tier');
              const h2 = card.querySelector('h2');
              if ((tier && tier.trim() === selectedCategoryLS) || (h2 && h2.textContent.trim() === selectedCategoryLS)) {
                card.classList.add('selected');
                // If there's a select button, mark it as selected too
                const selectBtn = card.querySelector('.select-btn, .choose-btn');
                if (selectBtn) selectBtn.classList.add('selected');
              } else {
                card.classList.remove('selected');
                const selectBtn = card.querySelector('.select-btn, .choose-btn');
                if (selectBtn) selectBtn.classList.remove('selected');
              }
            });
          }, 400);
        }
      }
    } else {
      currentPage = 0;
      currentRotation = 0;
      renderCurrentQuestion();
      currentStep = 0;
      renderHorizontalProgressBar();
      renderCircularProgressBar();

      // Initialize step counter for new users
      updateStepCounter();
    }

    // --- Restore projectType selection if present ---
    if (restoredProjectType) {
      // Find the type id for the restored projectType
      const selectedType = allInteriorTypes.find(t => t.name === restoredProjectType);
      if (selectedType) {
        selectedInteriorTypeId = Number(selectedType.id);
        // Highlight the correct circle menu item
        menu.querySelectorAll('a').forEach(el => {
          if (el.textContent === restoredProjectType) {
            el.classList.add('active');
          } else {
            el.classList.remove('active');
          }
        });
        // Render rooms for selected type
        renderRoomConfig(selectedType);
        // Show the room config section
        const roomConfigSection = document.getElementById('room-config-section');
        if (roomConfigSection) {
          roomConfigSection.style.display = 'block';
          // Scroll to the room config section with an offset for sticky header
          const yOffset = -380; // Account for sticky header height
          const y = roomConfigSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
        setStepBySection('room-config-section');
      }
    } else {
      // If projectType is not present and not all questions are answered, ensure progress bar is at survey step
      setStepBySection('arrow-section');
    }

    leftArrow.addEventListener("click", () => {
      turnWheel(true);
    });
    rightArrow.addEventListener("click", () => {
      // INFO SECTIONS: Hide tooltip on interaction
      if (typeof window.hideInitialTooltip === 'function') {
        window.hideInitialTooltip();
        if (typeof window.toggleInfoBox === 'function') window.toggleInfoBox();
      }
      turnWheel();
    });
    // document.addEventListener("keydown", checkInput);

    // Fetch and render styles
    stylesData = data.styles || [];

    // --- Show/hide start-btn-container and mainContent logic ---
    const appSection = document.getElementById('mainContent');
    const anyAnswered = document.querySelector('input[type="radio"][name^="question_\"]:checked');

    if (appSection) {
      appSection.style.display = 'flex';
    }
    // --- End show/hide logic ---

    // ... existing code ...
    // ... existing code ...
    window.addEventListener('load', function () {
      // Show processing popup
      if (typeof showProcessingPopup === 'function') showProcessingPopup();

      // Wait for all content to load, then scroll to the last attempt/history section
      setTimeout(function () {
        // Replace 'last-attempt-section' with the actual id of your last attempt/history section
        var lastSection = document.getElementById('last-attempt-section');
        if (lastSection) {
          lastSection.scrollIntoView({ behavior: 'smooth' });
        }
        // Hide processing popup
        if (typeof hideProcessingPopup === 'function') hideProcessingPopup();
      }, 1200); // Adjust delay as needed for your content

      // --- House Architecture UI Handlers ---
      const floorOptions = document.querySelectorAll('.floor-option');
      const preconOptions = document.querySelectorAll('.precon-option');
      const floorInput = document.getElementById('floor_type');
      const preconInput = document.getElementById('preconstruction_items');

      // Single Select for Floors
      floorOptions.forEach(opt => {
        opt.addEventListener('click', () => {
          floorOptions.forEach(o => o.classList.remove('selected-arch'));
          opt.classList.add('selected-arch');
          floorInput.value = opt.getAttribute('data-value');

          // Update global state
          window.surveyResponses = window.surveyResponses || {};
          window.surveyResponses.architectureDetails = window.surveyResponses.architectureDetails || {};
          window.surveyResponses.architectureDetails.floors = floorInput.value;
          saveSurveyResponsesToLocalStorage();
        });
      });

      // Multi Select for Pre-Construction
      preconOptions.forEach(opt => {
        opt.addEventListener('click', () => {
          opt.classList.toggle('selected-arch');

          const selected = Array.from(preconOptions)
            .filter(o => o.classList.contains('selected-arch'))
            .map(o => o.getAttribute('data-value'));

          preconInput.value = JSON.stringify(selected);

          // Update global state
          window.surveyResponses = window.surveyResponses || {};
          window.surveyResponses.architectureDetails = window.surveyResponses.architectureDetails || {};
          window.surveyResponses.architectureDetails.preConstruction = selected;
          saveSurveyResponsesToLocalStorage();
        });
      });

      // Inject Custom CSS for selection
      const style = document.createElement('style');
      style.innerHTML = `
        .selected-arch {
            background-color: #ffdce0 !important;
            border-color: #e50215 !important;
            position: relative;
        }
        .selected-arch::after {
            content: '✔';
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #e50215;
            font-weight: bold;
        }
    `;
      document.head.appendChild(style);

    });
    // ... existing code ...
  } catch (error) {
    console.error('[DEBUG] Error in DOMContentLoaded:', error);
    alert('Error loading survey questions. Please refresh the page.');
  }
});




// ScrollReveal().reveal('.prj_typeheading', {
//   duration: 1000,
//   distance: '40px',
//   origin: 'bottom',
//   opacity: 0,
//   easing: 'ease-out',
//   reset: true,
//   delay: 100
// });

ScrollReveal().reveal('#circleMenu', {
  duration: 100,
  distance: '40px',
  origin: 'bottom',
  opacity: 0,
  easing: 'ease-out',
  reset: true,
  delay: 100
});

setTimeout(() => {
  ScrollReveal().reveal('.room-config-item', {
    duration: 100,
    distance: '30px',
    origin: 'bottom',
    opacity: 0,
    easing: 'ease-out',
    reset: true,
    interval: 100
  });
}, 100);

// Remove the global setTimeout(() => { ScrollReveal().reveal('.style-card', ...); }, 100); block




// const hamburgeer = document.getElementById('hamburgerBtn');
const nav = document.querySelector('.style-navigator');

// hamburgeer.addEventListener('click', () => {
//   nav.classList.toggle('open');
// });

const container = document.getElementById('stylesContainer');
const navList = document.getElementById('navList');


// contact us
const btn = document.getElementById("btn-alt");
const close = document.getElementById("close-alt");
const menu_btn = document.getElementById("menu-alt");

btn.addEventListener("click", () => {
  btn.style.width = "100%";
  btn.style.height = "100%";
  btn.style.borderRadius = "0%";
  menu_btn.classList.add("show");
  close.classList.add("show");

  // Increase section height when form is shown
  const qformSection = document.getElementById('qform-alt');
  if (qformSection) {
    qformSection.style.minHeight = '100vh';
  }
});

close.addEventListener("click", () => {
  btn.style.width = "150px";
  btn.style.height = "150px";
  btn.style.borderRadius = "0%";
  menu_btn.classList.remove("show");
  close.classList.remove("show");

  // Reset section height to original
  const qformSection = document.getElementById('qform-alt');
  if (qformSection) {
    qformSection.style.minHeight = '60vh';
  }

  setTimeout(() => {
    btn.style.borderRadius = "50%";
  }, 200);
});








// contact form submit logic
let contactFormSubmitted = false;

let selectedServices = [];
window.currentIndex = 0;

const imagesUrl = [
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1470&q=80",
  "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1470&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1470&q=80",
  "https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=1471&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1470&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1470&q=80"
];


const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", function (e) {
  // console.log("Contact form submit clicked");

  // Check if all required fields are filled
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const pincode = document.getElementById('pincode').value.trim();

  if (!firstName || !lastName || !email || !phone || !pincode) {
    e.preventDefault();
    showToast('Please fill in all required fields (First Name, Last Name, Email, Phone, PIN Code).');
    return;
  }

  // Check if design category is selected
  if (!window.surveyResponses?.selectedCategory) {
    e.preventDefault();
    showToast('Please select a design category first before proceeding to cost estimate.');
    // Scroll to design categories section
    const designCategoriesSection = document.getElementById('design_categories');
    if (designCategoriesSection) {
      designCategoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }

  e.preventDefault(); // prevent default form submission
  const form = e.target;
  const formData = new FormData(form);

  fetch(form.action, {
    method: form.method,
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        // Try to read error message from response
        return response.text().then(msg => { throw new Error(msg || "Form submission failed"); });
      }
      return response.text();
    })
    .then((data) => {
      // Try to parse as JSON for city info
      let parsed = null;
      try {
        parsed = JSON.parse(data);
      } catch (e) { }

      // Only update service section if form submission was successful (not bad request)
      if ((parsed && parsed.success) || data.trim() === "OK") {
        // Capture Form Data into Global State immediately
        window.surveyResponses = window.surveyResponses || {};
        window.surveyResponses.firstName = document.getElementById('firstName').value.trim();
        window.surveyResponses.lastName = document.getElementById('lastName').value.trim();
        window.surveyResponses.email = document.getElementById('email').value.trim();
        window.surveyResponses.phone = document.getElementById('phone').value.trim();
        window.surveyResponses.pincode = document.getElementById('pincode').value.trim();
        window.surveyResponses.countryCode = document.getElementById('countryCode').value;
        // window.surveyResponses.whatsapp = document.querySelector('input[name="whatsapp"]')?.checked ? 1 : 0;
        window.surveyResponses.whatsapp = 0;

        // Store city and session_id if available in response
        if (parsed && parsed.city) {
          surveyResponses.city = parsed.city;

          // Store session_id in sessionStorage
          if (parsed.session_id) {
            sessionStorage.setItem('session_id', parsed.session_id);
            window.surveyResponses.sessionId = parsed.session_id;
          }

          // console.log("DEBUG: surveyResponses before save:", JSON.stringify(window.surveyResponses));

          saveSurveyResponsesToLocalStorage();
        }

        // Always fetch and update services for the current city
        const currentCity = surveyResponses.city;
        if (currentCity) {

          // Reset service state
          currentIndex = 0;

          fetch('assets/api/getServicesByCity.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              city: currentCity,
              projectType: window.surveyResponses?.projectType || 'Home Interior'
            })
          })
            .then(res => res.json())
            .then(data => {
              // Store city and style rates globally
              if (data.city_rates) window.currentCityRates = data.city_rates;
              if (data.style_rates) window.currentStyleRates = data.style_rates;

              if (data.success && Array.isArray(data.services)) {
                // Assign static images, cycling if needed
                const servicesWithImages = data.services.map((service, idx) => ({
                  ...service,
                  image: imagesUrl[idx % imagesUrl.length]
                }));
                window.currentServices = servicesWithImages;
                // console.log('servicesWithImages', data.services);

                // Clear and re-render service cards
                const container = document.getElementById('alacrity-slider-track');
                if (container) {
                  container.innerHTML = '';
                }
                renderServiceCards(servicesWithImages);

                // Update service selection counter (should be 0 after city change)
                updateServiceSelectionCounter();

                // Ensure smooth navigation by properly updating card positions
                setTimeout(() => {
                  // Reset current index to 0 for new services
                  window.currentIndex = 0;
                  updateCardPositions();
                  // Re-attach event listeners to ensure they work with new cards
                  attachEventListeners();
                }, 100);

                // Show cost estimate section directly instead of service section
                const estimateSection = document.getElementById('estimate_section');
                const houseArchSection = document.getElementById('house_architecture_section');
                if (estimateSection) {
                  // Hide all other sections
                  const sectionsToHide = [
                    "arrow-section",
                    "prj-type-sel-section",
                    "room-config-section",
                    "Design_Style",
                    "design_categories",
                    "qform-alt"
                  ];

                  utils.hideElements(sectionsToHide.map(id => `#${id}`));

                  // Show estimate section
                  utils.showElement('#estimate_section');
                  estimateSection.classList.add("show");

                  // Disable progress bar clicks when estimate section is shown
                  setProgressBarClickable(false);



                  if (houseArchSection) {
                    houseArchSection.style.display = 'none';
                  }

                  // Populate estimate data (this will save survey response after successful contact form)
                  populateEstimateData();

                  // Scroll to top
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  });
                }
              } else {
                showToast('No services found for your city.');
              }
            })
            .catch(err => {
              showToast('Could not load services for your city.');
            });
        }

        // Contact form submitted successfully - now save survey response
        window.isContactFormSubmitted = true;
        // Update progress bar to show 100%
        renderCircularProgressBar();
        renderHorizontalProgressBar();

        // Extract contact form values
        const contactFirstName = form.querySelector('#firstName').value.trim();
        const contactLastName = form.querySelector('#lastName').value.trim();
        const contactEmail = form.querySelector('#email').value.trim();
        const contactCountryCode = form.querySelector('#countryCode').value;
        const contactPhone = form.querySelector('#phone').value.trim();
        const contactPincode = form.querySelector('#pincode').value.trim();
        // const contactWhatsapp = form.querySelector('#whatsapp').checked ? 1 : 0;
        const contactWhatsapp = 0;

        // Store contact form data in surveyResponses (will be saved to DB when populateEstimateData is called)
        window.surveyResponses = window.surveyResponses || {};
        surveyResponses.firstName = contactFirstName;
        surveyResponses.lastName = contactLastName;
        surveyResponses.email = contactEmail;
        surveyResponses.countryCode = contactCountryCode;
        surveyResponses.phone = contactPhone;
        surveyResponses.pincode = contactPincode;
        surveyResponses.whatsapp = contactWhatsapp;
        saveSurveyResponsesToLocalStorage();

        // Enable service selection
        document.querySelectorAll('.alacrity-service-card').forEach(card => {
          card.classList.remove('disabled');
        });
        setStepBySection('service_section');
      }
    })
    .catch((error) => {
      // Just show the error message as toast, no console error
      showToast(error.message || "An error occurred. Please try again.");

      // Hide service section if there's a bad request (invalid pincode)
      const serviceSection = document.getElementById('service_section');
      if (serviceSection) {
        serviceSection.style.display = 'none';
      }
    });
});
// if (contactForm) {


// }

// Add at the top (after other global variables)
window.isContactFormSubmitted = false;

// Add a function to listen for contact form submission
function setupContactFormSubmissionTracking() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('alacritys:formSuccess', function () {
      window.isContactFormSubmitted = true;
      // Update progress bar to show 100%
      renderCircularProgressBar();
      renderHorizontalProgressBar();
    });
  }
}

// Call this on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupContactFormSubmissionTracking);
} else {
  setupContactFormSubmissionTracking();
}


function setupDesignCategorySelection() {
  const chooseBtns = document.querySelectorAll('#design_categories .choose-btn');
  chooseBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      // Remove .selected from all
      chooseBtns.forEach(b => b.classList.remove('selected'));
      // Add .selected to this
      this.classList.add('selected');
      // Set surveyResponses.selectedCategory
      const categoryName = this.closest('.image')?.querySelector('h2')?.textContent?.trim();
      if (categoryName) {
        window.surveyResponses = window.surveyResponses || {};
        window.surveyResponses.selectedCategory = categoryName;
        saveSurveyResponsesToLocalStorage();

      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupDesignCategorySelection);
} else {
  setupDesignCategorySelection();
}

document.addEventListener('DOMContentLoaded', function () {
  const heading = document.querySelector('.text-anime-style-2');
  if (heading) {
    // Split text into spans for each word or space
    const text = heading.textContent;
    heading.innerHTML = '';
    text.split(/(\s+)/).forEach((word, i) => {
      const span = document.createElement('span');
      if (/^\s+$/.test(word)) {
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = word;
      }
      span.style.opacity = 0;
      span.style.display = 'inline-block';
      span.style.transform = 'translateX(20px)';
      span.className = 'anime-word';
      heading.appendChild(span);
    });
    // Animate on scroll into view
    const observer = new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const words = heading.querySelectorAll('.anime-word');
          words.forEach((span, i) => {
            setTimeout(() => {
              span.style.transition = 'opacity 0.4s, transform 0.4s';
              span.style.opacity = 1;
              span.style.transform = 'translateX(0)';
            }, 120 * i);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(heading);
  }
});





// Function to format service name with styled brackets
function formatServiceName(name) {
  // Use regex to find text inside parentheses and wrap it with styled span
  return name.replace(/\(([^)]+)\)/g, '<span class="service-name-detail">($1)</span>');
}

// category section logic
function renderServiceCards(services) {
  const container = document.getElementById('alacrity-slider-track');
  // Place the counter directly below the .alacrity-services-header
  let counter = document.getElementById('service-selection-counter');
  const servicesContainer = container.closest('.alacrity-services-container');
  const header = servicesContainer ? servicesContainer.querySelector('.alacrity-services-header') : null;
  if (servicesContainer && header) {
    if (!counter) {
      counter = document.createElement('div');
      counter.id = 'service-selection-counter';
      counter.className = 'service-selection-status';
      header.insertAdjacentElement('afterend', counter);
    }
    const selectedCount = window.surveyResponses?.selectedServices?.length || 0;
    counter.textContent = `${selectedCount} / ${services.length} Selected`;
  }

  container.innerHTML = ''; // Clear previous cards

  services.forEach((service, index) => {
    const card = document.createElement('div');
    card.className = 'alacrity-service-card';
    card.dataset.serviceId = service.service_id;
    card.dataset.index = index;

    card.innerHTML = `
      <div class="alacrity-service-image">
        <img src="${service.image}" alt="${service.name}" loading="lazy">
      </div>
      <div class="alacrity-service-content">
        <h3 class="alacrity-service-name">${formatServiceName(service.name)}</h3>
        <p class="alacrity-service-description">${service.description || ''}</p>
        <div class="alacrity-service-price" style="display:none;">₹${service.price}/-</div>
        <div class="alacrity-select-service">
          <button class="alacrity-select-btn">
            <span class="btn-icon"><i class="fas fa-check-circle"></i></span>
            <span class="btn-text">Select Service</span>
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
  updateCardPositions();
  attachEventListeners();

  // Update visual state of service cards after rendering
  setTimeout(() => {
    updateServiceCardVisualState();
  }, 100);
}

function updateServiceSelectionCounter() {
  const counter = document.getElementById('service-selection-counter');
  const total = window.currentServices ? window.currentServices.length : 0;
  const selectedCount = window.surveyResponses?.selectedServices?.length || 0;
  if (counter) {
    counter.textContent = `${selectedCount} / ${total} Selected`;
  }
}

function updateCardPositions() {
  const cards = document.querySelectorAll('.alacrity-service-card');
  const totalCards = cards.length;

  // Add smooth transition to all cards
  cards.forEach(card => {
    card.style.transition = 'all 0.5s ease';
  });

  cards.forEach((card, index) => {
    // Reset all classes but preserve selected state
    const serviceId = card.dataset.serviceId;
    const selectedServices = window.surveyResponses?.selectedServices || [];
    const selectedServiceIds = selectedServices.map(s => s.service_id);
    const wasSelected = selectedServiceIds.includes(serviceId);

    // Reset all classes
    card.className = 'alacrity-service-card';

    // Calculate relative position
    let position = (index - window.currentIndex + totalCards) % totalCards;

    // Spread cards evenly with proper spacing
    if (position === 0) {
      card.classList.add('active');
      // Active card: centered, full scale, full opacity
      card.style.transform = 'translateX(-50%) scale(1)';
      card.style.opacity = '1';
      card.style.zIndex = '3';
      card.style.pointerEvents = 'auto';
    } else if (position === 1) {
      card.classList.add('next');
      // Next card: right side, evenly spaced
      card.style.transform = 'translateX(25%) scale(0.9) rotateY(5deg)';
      card.style.opacity = '0.9';
      card.style.zIndex = '2';
      card.style.pointerEvents = 'auto'; // allow clicks
    } else if (position === totalCards - 1) {
      card.classList.add('prev');
      // Prev card: left side, evenly spaced
      card.style.transform = 'translateX(-125%) scale(0.9) rotateY(-5deg)';
      card.style.opacity = '0.9';
      card.style.zIndex = '2';
      card.style.pointerEvents = 'auto'; // allow clicks
    } else if (position === 2) {
      card.classList.add('far-next');
      // Far next card: further right, evenly spaced
      card.style.transform = 'translateX(100%) scale(0.8) rotateY(10deg)';
      card.style.opacity = '0.8';
      card.style.zIndex = '1';
      card.style.pointerEvents = 'auto'; // allow clicks
    } else if (position === totalCards - 2) {
      card.classList.add('far-prev');
      // Far prev card: further left, evenly spaced
      card.style.transform = 'translateX(-200%) scale(0.8) rotateY(-10deg)';
      card.style.opacity = '0.8';
      card.style.zIndex = '1';
      card.style.pointerEvents = 'auto'; // allow clicks
    } else {
      card.classList.add('hidden');
      // Hidden cards: very small, centered, low opacity
      card.style.transform = 'translateX(-50%) scale(0.7)';
      card.style.opacity = '0';
      card.style.zIndex = '0';
      card.style.pointerEvents = 'none';
    }

    // Always restore selected state if it was selected (don't change position)
    if (wasSelected) {
      card.classList.add('alacrity-selected');
      const btn = card.querySelector('.alacrity-select-btn');
      if (btn) {
        btn.innerHTML = '<i class="fas fa-check"></i> Selected';
      }
    }
  });

  // Remove transition after animation completes
  setTimeout(() => {
    cards.forEach(card => {
      card.style.transition = '';
    });
  }, 500);
}

function attachEventListeners() {
  // Remove existing event listeners to prevent duplicates
  const leftArrow = document.querySelector('.alacrity-left');
  const rightArrow = document.querySelector('.alacrity-right');

  if (leftArrow) {
    leftArrow.replaceWith(leftArrow.cloneNode(false));
  }
  if (rightArrow) {
    rightArrow.replaceWith(rightArrow.cloneNode(false));
  }

  // Arrow click handlers with smooth navigation
  document.querySelector('.alacrity-left').addEventListener('click', () => {
    // Add click animation to arrow
    const leftArrow = document.querySelector('.alacrity-left');
    leftArrow.style.transform = 'scale(0.9)';
    setTimeout(() => {
      leftArrow.style.transform = 'scale(1)';
    }, 150);

    window.currentIndex = (window.currentIndex - 1 + window.currentServices.length) % window.currentServices.length;
    updateCardPositions();
  });

  document.querySelector('.alacrity-right').addEventListener('click', () => {
    // Add click animation to arrow
    const rightArrow = document.querySelector('.alacrity-right');
    rightArrow.style.transform = 'scale(0.9)';
    setTimeout(() => {
      rightArrow.style.transform = 'scale(1)';
    }, 150);

    window.currentIndex = (window.currentIndex + 1) % window.currentServices.length;
    updateCardPositions();
  });

  // Service selection - use event delegation to handle dynamically created buttons
  const sliderTrack = document.getElementById('alacrity-slider-track');
  if (sliderTrack) {
    // Remove existing click listener to prevent duplicates
    const newSliderTrack = sliderTrack.cloneNode(true);
    sliderTrack.parentNode.replaceChild(newSliderTrack, sliderTrack);

    newSliderTrack.addEventListener('click', function (e) {

      // 1. Handle "Select Service" button click
      const selectBtn = e.target.closest('.alacrity-select-btn');
      if (selectBtn) {
        e.preventDefault();
        e.stopPropagation();

        // Block selection if contact form is not filled
        if (!window.isContactFormSubmitted) {
          showToast('Please submit the contact form before selecting services.');
          const contactFormSection = document.getElementById('qform-alt');
          if (contactFormSection) {
            contactFormSection.scrollIntoView({ behavior: 'smooth' });
          }
          return;
        }

        const card = selectBtn.closest('.alacrity-service-card');
        const serviceId = card.dataset.serviceId;
        const isSelected = card.classList.contains('alacrity-selected');

        if (!handleServiceSelection(serviceId, !isSelected)) {
          return;
        }

        if (isSelected) {
          card.classList.remove('alacrity-selected');
          selectBtn.innerHTML = '<i class="fas fa-check-circle"></i> Select Service';
        } else {
          card.classList.add('alacrity-selected');
          selectBtn.innerHTML = '<i class="fas fa-check"></i> Selected';
        }
        return; // Stop here if button was clicked
      }

      // 2. Handle general Card Click (Navigation)
      const card = e.target.closest('.alacrity-service-card');
      if (card) {
        const clickedIndex = parseInt(card.dataset.index, 10);
        if (!isNaN(clickedIndex) && clickedIndex !== window.currentIndex) {
          // Navigate to clicked card
          window.currentIndex = clickedIndex;
          updateCardPositions();
        }
      }
    });
  }


  // Add touch/swipe functionality for service cards (alongside arrow navigation)
  const sliderTrackForTouch = document.getElementById('alacrity-slider-track');
  if (!sliderTrackForTouch) return;

  let touchStartX = 0;
  let touchStartY = 0;
  let mouseStartX = 0;
  let mouseStartY = 0;
  let isDragging = false;

  // Enhanced touch events for mobile
  sliderTrackForTouch.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;

    // Add visual feedback during touch
    const cards = sliderTrackForTouch.querySelectorAll('.alacrity-service-card');
    cards.forEach(card => {
      card.style.transition = 'all 0.2s ease-out';
    });
  }, { passive: true });

  sliderTrackForTouch.addEventListener('touchmove', (e) => {
    // Only prevent default for horizontal swipes, allow vertical scrolling
    const touchX = e.changedTouches[0].screenX;
    const touchY = e.changedTouches[0].screenY;
    const diffX = Math.abs(touchX - touchStartX);
    const diffY = Math.abs(touchY - touchStartY);

    // If horizontal movement is greater than vertical, prevent default
    if (diffX > diffY) {
      e.preventDefault();
    }
  }, { passive: false });

  sliderTrackForTouch.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const threshold = 50; // Increased threshold for better accuracy
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Only handle horizontal swipes (ignore vertical scrolling)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Swipe left - go to next card
        window.currentIndex = (window.currentIndex + 1) % window.currentServices.length;
      } else {
        // Swipe right - go to previous card
        window.currentIndex = (window.currentIndex - 1 + window.currentServices.length) % window.currentServices.length;
      }
      // Update card positions with smooth animation
      updateCardPositions();
    }
  }, { passive: true });

  // Enhanced mouse events for desktop
  sliderTrackForTouch.addEventListener('mousedown', (e) => {
    isDragging = true;
    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
    sliderTrackForTouch.style.cursor = 'grabbing';
    e.preventDefault();

    // Add visual feedback during drag
    const cards = sliderTrackForTouch.querySelectorAll('.alacrity-service-card');
    cards.forEach(card => {
      card.style.transition = 'all 0.2s ease-out';
    });
  });

  sliderTrackForTouch.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const mouseEndX = e.clientX;
    const mouseEndY = e.clientY;
    const threshold = 50; // Increased threshold for better accuracy
    const diffX = mouseStartX - mouseEndX;
    const diffY = mouseStartY - mouseEndY;


    // Only handle horizontal drags (ignore vertical scrolling)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Drag left - go to next card
        window.currentIndex = (window.currentIndex + 1) % window.currentServices.length;
      } else {
        // Drag right - go to previous card
        window.currentIndex = (window.currentIndex - 1 + window.currentServices.length) % window.currentServices.length;
      }

      // Update card positions with smooth animation
      updateCardPositions();

      // Reset drag state
      isDragging = false;
      sliderTrackForTouch.style.cursor = 'grab';
    }
  });

  sliderTrackForTouch.addEventListener('mouseup', () => {
    isDragging = false;
    sliderTrackForTouch.style.cursor = 'grab';
  });

  sliderTrackForTouch.addEventListener('mouseleave', () => {
    isDragging = false;
    sliderTrackForTouch.style.cursor = 'grab';
  });

  // Set initial cursor style
  sliderTrackForTouch.style.cursor = 'grab';

  // Add individual card touch events for better responsiveness
  const cards = sliderTrackForTouch.querySelectorAll('.alacrity-service-card');
  cards.forEach(card => {
    // Add touch events to individual cards
    card.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    card.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const threshold = 50;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          window.currentIndex = (window.currentIndex + 1) % window.currentServices.length;
        } else {
          window.currentIndex = (window.currentIndex - 1 + window.currentServices.length) % window.currentServices.length;
        }
        updateCardPositions();
      }
    }, { passive: true });
  });


  // Add event listeners for estimate section buttons
  const calculateAgainBtn = document.querySelector('.custom-btn.secondary');
  if (calculateAgainBtn) {
    calculateAgainBtn.addEventListener('click', function () {

      // Hide estimate section
      const estimateSection = document.getElementById('estimate_section');

      if (estimateSection) {
        estimateSection.style.display = 'none';
        estimateSection.classList.remove('show');
      }

      // Show all other sections
      const sectionsToShow = [
        "arrow-section",
        "prj-type-sel-section",
        "room-config-section",
        "Design_Style",
        "design_categories",
        "qform-alt",
        "service_section"
      ];

      sectionsToShow.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          if (["prj-type-sel-section", "arrow-section", "service_section", "qform-alt"].includes(id)) {
            el.style.display = "flex";
          } else {
            el.style.display = "block";
          }
        }
      });

      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Add dropdown functionality for estimate section
  const dropdownRows = document.querySelectorAll('.dropdown-row');
  dropdownRows.forEach(row => {
    row.addEventListener('click', function (e) {
      e.stopPropagation();

      // Close other dropdowns
      dropdownRows.forEach(otherRow => {
        if (otherRow !== this) {
          otherRow.classList.remove('active');
        }
      });

      // Toggle current dropdown
      this.classList.toggle('active');
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function () {
    dropdownRows.forEach(row => {
      row.classList.remove('active');
    });
  });



  // Add toggle functionality for comparison section
  const toggleFeaturesBtn = document.getElementById('toggle-features');
  if (toggleFeaturesBtn) {
    toggleFeaturesBtn.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);

      if (isExpanded) {
        this.textContent = 'Show More';
        this.querySelector('.toggle-icon').textContent = '▼';
        // Hide additional features if any
      } else {
        this.textContent = 'Show Less';
        this.querySelector('.toggle-icon').textContent = '▲';
        // Show additional features if any
      }
    });
  }

  updateCardPositions();
}

function handleServiceSelection(serviceId, isSelected) {
  // console.log(`Service selection: ${serviceId}, isSelected: ${isSelected}`);

  // Initialize selectedServices from surveyResponses or create empty array
  let selectedServices = window.surveyResponses?.selectedServices?.map(s => s.service_id) || [];

  if (isSelected) {
    if (serviceId && !selectedServices.includes(serviceId)) {
      selectedServices.push(serviceId);
    }
  } else {
    selectedServices = selectedServices.filter(id => id !== serviceId);
  }

  // console.log('Current selected services:', selectedServices);

  // Calculate total service cost - FIXED: Include per sq.ft. multiplication
  const currentServices = window.currentServices || [];
  let totalServiceCost = 0;

  // Get total room area for per sq.ft. services
  const totalRoomArea = parseFloat(
    window.estimateData?.costBreakdown?.areaCalculations?.total_room_area || 0
  ) || 0;

  // Use the selectedServices from surveyResponses (which contains objects with service_id)
  const selectedServicesFromStorage = selectedServices.map(serviceId => ({ service_id: serviceId }));
  selectedServicesFromStorage.forEach(selectedService => {
    const serviceData = currentServices.find(service => service.service_id == selectedService.service_id);
    if (serviceData) {
      const basePrice = parseFloat(serviceData.price) || 0;
      // FIXED: Multiply by area for per sq.ft. services
      if (serviceData.name && serviceData.name.includes('per sq. ft.')) {
        totalServiceCost += basePrice * totalRoomArea;
      } else {
        totalServiceCost += basePrice;
      }
    }
  });

  // Store selected services in surveyResponses (only if services are selected)
  window.surveyResponses.selectedServices = selectedServicesFromStorage;

  // Only store totalServiceCost if services are actually selected
  if (totalServiceCost > 0) {
    window.surveyResponses.totalServiceCost = totalServiceCost;
  } else {
    // Remove totalServiceCost if no services selected
    delete window.surveyResponses.totalServiceCost;
  }

  saveSurveyResponsesToLocalStorage();

  // Update the selection counter (after storing the data)
  updateServiceSelectionCounter();



  // Update all offer item prices and sync chosen offer
  // updateOfferPrices(totalServiceCost);

  // Update cost summary if estimate data is available
  if (window.estimateData) {
    // Create a copy of estimate data with updated service information
    const updatedEstimateData = {
      ...window.estimateData,
      surveyResponses: {
        ...window.estimateData.surveyResponses,
        selectedServices: window.surveyResponses.selectedServices
      }
    };
    updateCostSummary(updatedEstimateData);
  }

  // Update visual state of service cards
  updateServiceCardVisualState();

  // Auto-scroll to next card if service was selected
  if (isSelected) {
    autoScrollToNextCard();
  }

  // Check and show payment sections if services are selected
  checkAndShowPaymentSections();

  // ----------------------------------------------------
  // EXTRA: Build detailed processed services (flat + per sq. ft.)
  // ----------------------------------------------------
  // Note: totalRoomArea already declared above at line 2825

  let processedServices = [];
  let grandTotal = 0;

  selectedServices.forEach(id => {
    const serviceData = currentServices.find(s => s.service_id == id);
    if (!serviceData) return;

    const basePrice = parseFloat(serviceData.price) || 0;
    let quantity = serviceData.sq ?? null;
    let total = basePrice;

    if (serviceData.name?.includes("per sq. ft.")) {
      quantity = totalRoomArea;
      total = basePrice * quantity;
    } else {
      total = basePrice;
    }

    grandTotal += total;

    processedServices.push({
      service_id: serviceData.service_id,
      name: serviceData.name,
      price: basePrice,
      sq: quantity,
      totalCost: total
    });
  });

  // Always update total service cost display (detail row version only)
  const totalServiceCostElement = document.getElementById('totalServiceCost');
  if (totalServiceCostElement) {
    if (processedServices.length > 0) {
      // console.log(`Selected Services: (${processedServices.length})`, processedServices);
      // console.log("Grand Total Cost:", grandTotal.toLocaleString());
      totalServiceCostElement.textContent = `₹${grandTotal.toLocaleString()}/-`;
    } else {
      // console.log("No services selected - setting total to ₹0");
      totalServiceCostElement.textContent = '₹0';
    }
  }

  // FORCE UPDATE OFFER SERVICES DISPLAY
  // This ensures the "Services Included in Offer" sidebar updates whenever services change
  const currentOfferName = window.surveyResponses?.selectedOffer ||
    localStorage.getItem('selected_offer_backup');

  if (currentOfferName && typeof updateOfferServicesDisplay === 'function') {
    updateOfferServicesDisplay(currentOfferName, processedServices);
  }

  // FORCE UPDATE ARCHITECTURE FIELDS
  if (typeof toggleArchitectureFields === 'function') {
    toggleArchitectureFields();
  }
}

// Update service display and costs considering offer inclusions
updateServiceDisplayAndCosts();

// Update total amount to pay with fresh service cost value
updateTotalAmountToPay();


// Function to auto-scroll to next card
function autoScrollToNextCard() {
  const currentServices = window.currentServices || [];
  const currentIndex = window.currentIndex || 0;

  if (currentServices.length > 1) {
    // Calculate next index
    const nextIndex = (currentIndex + 1) % currentServices.length;

    // Update current index
    window.currentIndex = nextIndex;

    // Update card positions with smooth animation
    updateCardPositions();

    // Add a small delay to make the transition more noticeable
    setTimeout(() => {
      // Optional: Add a subtle highlight to the new active card
      const cards = document.querySelectorAll('.alacrity-service-card');
      const activeCard = cards[nextIndex];
      if (activeCard) {
        activeCard.style.transform = activeCard.style.transform + ' scale(1.02)';
        setTimeout(() => {
          activeCard.style.transform = activeCard.style.transform.replace(' scale(1.02)', '');
        }, 100);
      }
    }, 100);
  }
}

// Update visual state of service cards based on selection
function updateServiceCardVisualState() {
  const cards = document.querySelectorAll('.alacrity-service-card');
  const selectedServices = window.surveyResponses?.selectedServices || [];
  const selectedServiceIds = selectedServices.map(s => s.service_id);

  cards.forEach(card => {
    const serviceId = card.dataset.serviceId;
    const btn = card.querySelector('.alacrity-select-btn');

    if (selectedServiceIds.includes(serviceId)) {
      // Service is selected - add selected styling
      card.classList.add('alacrity-selected');
      if (btn) {
        btn.innerHTML = '<i class="fas fa-check"></i> Selected';
      }
    } else {
      // Service is not selected - remove selected styling
      card.classList.remove('alacrity-selected');
      if (btn) {
        btn.innerHTML = 'Select';
      }
    }
  });
}
// --- Delegated event listener for slider cards and select buttons in the design category slider ---
const sliderTrack = document.getElementById('sliderTrack');
if (sliderTrack) {
  sliderTrack.addEventListener('click', function (e) {
    const selectBtn = e.target.closest('.select-btn');
    const sliderCard = e.target.closest('.slider-card');

    // If clicking on select button
    if (selectBtn) {
      const card = selectBtn.closest('.slider-card');
      let tier = card ? card.getAttribute('data-tier') : '';
      if (!tier) {
        // fallback: try to get from h2 if data-tier is missing
        const h2 = card.querySelector('h2');
        if (h2) tier = h2.textContent.trim();
      }



      // Check if any design style is selected
      const styleSelected = document.querySelector('#Design_Style input[type="radio"]:checked');
      if (!styleSelected) {
        const designStyleSection = document.getElementById('Design_Style');
        if (designStyleSection) {
          const yOffset = -60;
          const y = designStyleSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
        showToast('Please select a Design Style first.');
        return;
      }

      // Mark this button as selected, remove from others
      document.querySelectorAll('.select-btn.selected').forEach(btn => btn.classList.remove('selected'));
      selectBtn.classList.add('selected');

      // Update surveyResponses with the selected tier
      window.surveyResponses.selectedCategory = tier;
      saveSurveyResponsesToLocalStorage();
      setStepBySection('design_categories');

      // Populate dynamic compare section with new category
      populateDynamicCompareSection();

      // Scroll to contact form section
      const qformSection = document.getElementById('qform-alt');
      if (qformSection) {
        qformSection.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // If clicking on slider card (but not on select button)
    else if (sliderCard && !e.target.closest('.select-btn')) {
      let tier = sliderCard.getAttribute('data-tier') || '';
      if (!tier) {
        const h2 = sliderCard.querySelector('h2');
        if (h2) tier = h2.textContent.trim();
      }

      // Check if any design style is selected
      const styleSelected = document.querySelector('#Design_Style input[type="radio"]:checked');
      if (!styleSelected) {
        const designStyleSection = document.getElementById('Design_Style');
        if (designStyleSection) {
          const yOffset = -60;
          const y = designStyleSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
        showToast('Please select a Design Style first.');
        return;
      }

      // Update surveyResponses with the selected tier
      window.surveyResponses.selectedCategory = tier;
      saveSurveyResponsesToLocalStorage();
      setStepBySection('design_categories');


    }
  });
}

// Add touch/swipe functionality for design category slider (alongside arrow navigation)
const designSliderTrack = document.getElementById('sliderTrack');
if (designSliderTrack) {
  let touchStartX = 0;
  let touchStartY = 0;
  let mouseStartX = 0;
  let mouseStartY = 0;
  let isDragging = false;

  // Touch events for mobile
  designSliderTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  designSliderTrack.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const threshold = 50;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Only handle horizontal swipes (ignore vertical scrolling)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Swipe left - go to next card (same as next button)
        current = (current + 1) % (cardCount + 2);
        updateSlider();
      } else {
        // Swipe right - go to previous card (same as prev button)
        current = (current - 1 + cardCount + 2) % (cardCount + 2);
        updateSlider();
      }
    }
  }, { passive: true });

  // Mouse events for desktop
  designSliderTrack.addEventListener('mousedown', (e) => {
    isDragging = true;
    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
    designSliderTrack.style.cursor = 'grabbing';
    e.preventDefault();
  });

  designSliderTrack.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const mouseEndX = e.clientX;
    const mouseEndY = e.clientY;
    const threshold = 50;
    const diffX = mouseStartX - mouseEndX;
    const diffY = mouseStartY - mouseEndY;

    // Only handle horizontal drags (ignore vertical scrolling)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Drag left - go to next card
        current = (current + 1) % (cardCount + 2);
        updateSlider();
      } else {
        // Drag right - go to previous card
        current = (current - 1 + cardCount + 2) % (cardCount + 2);
        updateSlider();
      }

      // Reset drag state
      isDragging = false;
      designSliderTrack.style.cursor = 'grab';
    }
  });

  designSliderTrack.addEventListener('mouseup', () => {
    isDragging = false;
    designSliderTrack.style.cursor = 'grab';
  });

  designSliderTrack.addEventListener('mouseleave', () => {
    isDragging = false;
    designSliderTrack.style.cursor = 'grab';
  });

  // Set initial cursor style
  designSliderTrack.style.cursor = 'grab';
}

// Function to fetch room features and show modal
// function fetchRoomFeaturesAndShowModal() {
//   // Show loading state
//   const modal = document.getElementById('roomFeaturesModal');
//   const modalContent = document.getElementById('roomFeaturesModalContent');

//   if (modal) {
//     modal.style.display = 'flex';
//     modalContent.innerHTML = '<div style="text-align: center; padding: 50px;">Loading room features...</div>';
//   }

//   // Prepare data for API call
//   const requestData = {
//     selectedCategory: window.surveyResponses.selectedCategory || 'Standard',
//     selectedRooms: window.surveyResponses.selectedRooms || {},
//     selectedStyles: window.surveyResponses.selectedStyles || [],
//     projectType: window.surveyResponses.projectType || 'Home Interior'
//   };

//   console.log('Sending request data to API getRoomFeatures:', requestData);

//   // Fetch room features from API
//   fetch('assets/api/getRoomFeatures.php', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(requestData)
//   })
//     .then(response => response.json())
//     .then(data => {
//       console.log('API response getRoomFeatures:', data);
//       if (data.success) {
//         // The API returns roomFeatures directly, not nested under data
//         populateRoomFeaturesModal({
//           selectedCategory: window.surveyResponses.selectedCategory || 'Standard',
//           roomFeatures: data.roomFeatures
//         });
//       } else {
//         modalContent.innerHTML = '<div style="text-align: center; padding: 50px; color: red;">Error loading room features. Please try again.</div>';
//       }
//     })
//     .catch(error => {
//       modalContent.innerHTML = '<div style="text-align: center; padding: 50px; color: red;">Error loading room features. Please try again.</div>';
//     });
// }

// // Function to populate modal with room features
// function populateRoomFeaturesModal(data) {
//   const modalContent = document.getElementById('roomFeaturesModalContent');

//   // Check if data is valid
//   if (!data || typeof data !== 'object') {
//     modalContent.innerHTML = `
//       <button class="room-features-modal-close" id="roomFeaturesModalClose" aria-label="Close">&times;</button>
//       <div style="text-align: center; padding: 50px; color: red;">
//         Error: Invalid data received. Please try again.
//       </div>
//     `;
//     attachCloseButtonListener();
//     return;
//   }

//   const { selectedCategory, roomFeatures } = data;

//   // Check if we have room features
//   if (!roomFeatures || Object.keys(roomFeatures).length === 0) {
//     modalContent.innerHTML = `
//       <button class="room-features-modal-close" id="roomFeaturesModalClose" aria-label="Close">&times;</button>
//       <div style="text-align: center; padding: 50px; color: #666;">
//         No room features found for the selected configuration.
//       </div>
//     `;
//     attachCloseButtonListener();
//     return;
//   }

//   // Get the appropriate icon path based on selected category
//   let categoryIconPath = '';
//   switch (selectedCategory) {
//     case 'Standard':
//       categoryIconPath = 'assets/images/003-medal.webp';
//       break;
//     case 'Premium':
//       categoryIconPath = 'assets/images/001-star.webp';
//       break;
//     case 'Luxury':
//       categoryIconPath = 'assets/images/002-diamond.webp';
//       break;
//     case 'Personalized':
//       categoryIconPath = 'assets/images/003-medal.webp';
//       break;
//     default:
//       categoryIconPath = 'assets/images/003-medal.webp';
//   }

//   let modalHTML = `
//     <button class="room-features-modal-close" id="roomFeaturesModalClose" aria-label="Close">&times;</button>
//     <div class="room-features-modal-header">
//       <img src="${categoryIconPath}" alt="Category Icon">
//       <h2>${selectedCategory} Category Features</h2>
//     </div>
//     <div class="accordion-list">
//   `;

//   // Generate accordions for each room type
//   Object.keys(roomFeatures).forEach((roomType, index) => {
//     const roomData = roomFeatures[roomType];
//     const quantity = roomData.quantity;
//     const features = roomData.features;
//     const accId = `room-feature-acc-${index}`;
//     modalHTML += `
//       <div class="accordion-item" id="${accId}Item">
//         <div class="accordion-header" onclick="toggleAccordion('${accId}')">
//           <span><strong>${roomType}</strong> (${quantity})</span>
//           <span class="accordion-arrow" id="${accId}Arrow">&#8595;</span>
//         </div>
//         <div class="accordion-collapse">
//           <div class="accordion-body">
//             ${features && features.length > 0 ? features.map(f => {
//       let text = (f.room_item || 'Feature') + ': ' + (f.feature_description || 'Description not available');
//       let strong = text;
//       let desc = '';
//       if (text.includes(':')) {
//         strong = text.split(':')[0] + ':';
//         desc = text.split(':').slice(1).join(':');
//       }
//       return `<div style='margin-bottom: 18px;'><strong>${strong}</strong><br>${desc.trim()}</div>`;
//     }).join('') : `<div style='text-align:center; color:#666;'>No features available for this room type</div>`}
//           </div>
//         </div>
//       </div>
//     `;
//   });

//   modalHTML += `</div>`;
//   modalContent.innerHTML = modalHTML;
//   attachCloseButtonListener();
// }





// Back button logic - reverse of alacrityNextBtn
const estimateBackBtn = document.getElementById('estimateBackBtn');
if (estimateBackBtn) {
  estimateBackBtn.addEventListener('click', function () {
    // Show all survey sections
    const sectionsToShow = [
      "arrow-section",
      "prj-type-sel-section",
      "room-config-section",
      "Design_Style",
      "design_categories",
      "qform-alt",
      "service_section"
    ];

    // Show each section
    sectionsToShow.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (id === "prj-type-sel-section") {
          el.style.display = "flex";
        } else if (id === "arrow-section") {
          el.style.display = "flex";
        } else if (id === "service_section") {
          el.style.display = "flex";
        } else if (id === "qform-alt") {
          el.style.display = "flex";
        } else {
          el.style.display = "block";
        }
      }
    });

    // Hide the estimate section
    const estimateSection = document.getElementById("estimate_section");
    if (estimateSection) {
      estimateSection.style.display = "none";
      estimateSection.classList.remove("show");
    }

    // Enable progress bar clicks when returning from estimate section
    setProgressBarClickable(true);

    // Scroll to bottom smoothly with enhanced behavior
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);

    // Also scroll the document body to ensure it works on all browsers
    setTimeout(() => {
      document.body.scrollTop = document.body.scrollHeight;
      document.documentElement.scrollTop = document.documentElement.scrollHeight;
    }, 200);

    // Reset offer selection and service costs when going back
    resetOfferAndServiceSelection();
  });
}

// Function to reset offer selection and service costs
function resetOfferAndServiceSelection() {
  // console.log('Resetting offer and service selection...');

  // Set flag to prevent default initialization
  window.hasBeenReset = true;

  // Reset offer selection
  chosenOfferName = null;
  offerSelectedDetails = [];

  // Clear backup
  localStorage.removeItem('selected_offer_backup');

  // Remove active class from all offer items
  const offerItems = document.querySelectorAll('.offer-item');
  offerItems.forEach(item => {
    item.classList.remove('active');
  });

  // Hide the offer details section
  const detailsSection = document.querySelector('.offer-details-section');
  if (detailsSection) {
    detailsSection.style.display = 'none';
  }

  // Reset chosen offer display
  const chosenOfferElement = document.getElementById('chosenOffer');
  if (chosenOfferElement) {
    chosenOfferElement.textContent = '';
  }

  const paymentSelectedOffer = document.getElementById('paymentSelectedOffer');
  if (paymentSelectedOffer) {
    paymentSelectedOffer.textContent = '';
  }

  // Reset offer services display
  const summaryOfferServices = document.getElementById('summaryOfferServices');
  const offerServicesAccordionContent = document.getElementById('offerServicesAccordionContent');
  if (summaryOfferServices) {
    summaryOfferServices.textContent = 'Not Selected';
  }
  if (offerServicesAccordionContent) {
    offerServicesAccordionContent.innerHTML = '<ol class="services-list" id="offerServicesOrderedList"></ol>';
    const offerServicesOrderedList = document.getElementById('offerServicesOrderedList');
    if (offerServicesOrderedList) {
      const li = document.createElement('li');
      li.textContent = 'Select an offer to see what services are included in your plan';
      offerServicesOrderedList.appendChild(li);
    }
  }

  // Reset service selection in surveyResponses
  if (window.surveyResponses) {
    window.surveyResponses.selectedServices = [];
    delete window.surveyResponses.totalServiceCost;
  }

  // Clear localStorage to prevent cached data from being restored
  localStorage.removeItem('surveyResponses');

  // Reset service cost display
  const totalServiceCostElement = document.getElementById('totalServiceCost');
  if (totalServiceCostElement) {
    totalServiceCostElement.textContent = '₹0';
  }

  // Update service card visual state
  updateServiceCardVisualState();

  // Update service display and costs considering offer inclusions
  updateServiceDisplayAndCosts();

  // Update payment sections and total amount
  checkAndShowPaymentSections();

  console.log('Reset completed');
}

function updateCostSummary(data) {

  // Update the header section (unchanged)
  if (!data.designPreferences) {
    data.designPreferences = {
      selectedCategory: 'Standard',
      selectedStyle: 'Modern',
      styleMultiplier: 1.0,
      categoryMultiplier: 1.0
    };
  }
  const summaryBadge = document.querySelector('.summary-badge');
  if (summaryBadge) {
    summaryBadge.textContent = data.designPreferences.selectedCategory || 'N/A';
    summaryBadge.className = `summary-badge ${data.designPreferences.selectedCategory ? data.designPreferences.selectedCategory.toLowerCase() : ''}`;
  }
  // Ensure costBreakdown exists
  if (!data.costBreakdown) {
    data.costBreakdown = {
      final_project_cost: 0,
      areaCalculations: { total_room_area: 0 },
      services: { services: [] }
    };
  }

  // Ensure clientDetails exists
  if (!data.clientDetails) {
    data.clientDetails = {
      name: 'Guest',
      city: 'N/A',
      projectType: 'Home Interior'
    };
  }

  const summaryCost = document.querySelector('.summary-cost');
  if (summaryCost) {
    summaryCost.textContent = `${data.currency || '₹'}${(data.costBreakdown.final_project_cost || 0).toLocaleString()}/-`;
    if (data.costBreakdown.final_project_cost > 710000) {
      document.getElementById("completePurchaseBtn").onclick = function () {
        generatePDF(1);
      }
      document.getElementById("completePurchaseBtn").innerHTML = `<i class="fa fa-download"></i> Download Summary &
                      Get Free Design Proposal`;

    }
    else {
      document.getElementById("completePurchaseBtn").onclick = function () {
        generatePDF(2);
      }
      document.getElementById("completePurchaseBtn").innerHTML = `<i class="fa fa-download"></i> Download Summary`;
    }
  }

  const summaryUserName = document.getElementById('summaryUserName');
  if (summaryUserName) {
    summaryUserName.textContent = data.clientDetails.firstName || '';
  }

  const summaryProjectCost = document.getElementById('summaryProjectCost');
  if (summaryProjectCost) {
    const cost = data.costBreakdown.final_project_cost || 0;
    summaryProjectCost.textContent = `${data.currency || '₹'}${cost.toLocaleString()}/-`;
  }

  const summaryUserCity = document.getElementById('summaryUserCity');
  if (summaryUserCity) {
    summaryUserCity.textContent = data.clientDetails.city || '';
  }

  // Modern summary section fields
  const summaryProjectType = document.getElementById('summaryProjectType');
  if (summaryProjectType) {
    summaryProjectType.textContent = data.clientDetails.projectType || window.surveyResponses?.projectType || 'Home Interior';
  }

  const summaryCarpetArea = document.getElementById('summaryCarpetArea');
  if (summaryCarpetArea) {
    let totalArea = 0;
    if (data.costBreakdown.areaCalculations?.total_room_area) {
      totalArea = data.costBreakdown.areaCalculations.total_room_area;
    } else if (window.surveyResponses && window.surveyResponses.selectedRooms) {
      // Calculate area from survey responses if not available in data
      const roomAreas = {
        'Entrance Lobby & Living Room': 250,
        'Kitchen': 120,
        'Dining Room': 100,
        'Master Bedroom': 200,
        'Bedroom': 150,
        'Bathroom': 60,
        'Passage/Lobby/Corridor': 80,
        'Study Room': 120,
        'Puja Room': 50,
        'Store Room': 80,
        'Balcony': 40
      };

      Object.entries(window.surveyResponses.selectedRooms).forEach(([roomType, quantity]) => {
        const roomArea = roomAreas[roomType] || 100;
        totalArea += roomArea * quantity;
      });
    }
    summaryCarpetArea.textContent = totalArea > 0 ? totalArea + ' sqft' : '-';
  }

  // Ensure roomFeatures exists
  if (!data.roomFeatures) {
    data.roomFeatures = {};
  }

  // No. of Rooms accordion
  const summaryNumRooms = document.getElementById('summaryNumRooms');
  if (summaryNumRooms) {
    // Get room count from survey responses if roomFeatures is empty
    let numRooms = 0;
    if (data.roomFeatures && Object.keys(data.roomFeatures).length > 0) {
      numRooms = Object.keys(data.roomFeatures).length;
    } else if (window.surveyResponses && window.surveyResponses.selectedRooms) {
      numRooms = Object.keys(window.surveyResponses.selectedRooms).length;
    }
    summaryNumRooms.textContent = numRooms + ' Room' + (numRooms === 1 ? '' : 's');
  }

  const roomsAccordionContent = document.getElementById('roomsAccordionContent');
  if (roomsAccordionContent) {
    // Clear existing content and ensure ordered list structure
    roomsAccordionContent.innerHTML = '<ol class="rooms-list" id="roomsOrderedList"></ol>';
    const roomsOrderedList = document.getElementById('roomsOrderedList');
    const roomAreasx = {
      'Entrance Lobby & Living Room': 250,
      'Kitchen': 120,
      'Dining Room': 100,
      'Master Bedroom': 200,
      'Bedroom': 150,
      'Bathroom': 60,
      'Passage/Lobby/Corridor': 80,
      'Study Room': 120,
      'Puja Room': 50,
      'Store Room': 80,
      'Balcony': 40
    };

    if (data.roomFeatures && Object.keys(data.roomFeatures).length > 0) {
      //   Object.keys(data.roomFeatures).forEach((roomName, index) => {
      //     const li = document.createElement('li');
      //     const roomCount = data.roomFeatures[roomName];
      //     // Ensure roomCount is a number and handle any object conversion issues
      //     const displayCount = typeof roomCount === 'number' ? roomCount :
      //       (typeof roomCount === 'object' ? 1 : parseInt(roomCount) || 1);
      //     li.textContent = `${roomName} (${displayCount})`;
      //     roomsOrderedList.appendChild(li);
      //   });

      Object.keys(window.surveyResponses.selectedRooms || {}).forEach(room => {
        const count = window.surveyResponses.selectedRooms[room];
        const areas = (window.surveyResponses.carpetAreas && window.surveyResponses.carpetAreas[room]) || [];
        const areaText = areas.length > 0 ? `: ${areas.join(", ")} sq. ft.` : `${roomAreasx[room]} sq. ft.`;
        const li = document.createElement('li');
        li.textContent = `${room} (${count}) ${areaText}`;
        roomsOrderedList.appendChild(li);
      });

    } else if (window.surveyResponses && window.surveyResponses.selectedRooms) {
      // Fallback to survey responses for room names
      Object.keys(window.surveyResponses.selectedRooms).forEach((roomName, index) => {
        const li = document.createElement('li');
        const roomCount = window.surveyResponses.selectedRooms[roomName];
        // Ensure roomCount is a number and handle any object conversion issues
        const displayCount = typeof roomCount === 'number' ? roomCount :
          (typeof roomCount === 'object' ? 1 : parseInt(roomCount) || 1);
        li.textContent = `${roomName} (${displayCount})`;
        roomsOrderedList.appendChild(li);
      });
    }
  }

  // Style
  const summaryStyle = document.getElementById('summaryStyle');
  if (summaryStyle) {
    summaryStyle.textContent = data.designPreferences.selectedStyle || window.surveyResponses?.selectedStyles?.[0] || '-';
  }

  const floorx = document.getElementById('floor');
  if (floorx) {
    floorx.textContent = data.designPreferences.selectedFloor || window.surveyResponses?.selectedFloor?.[0] || '-';
  }
  const precost = document.getElementById('precost');
  if (precost) {

    precost.textContent = '₹' + data.designPreferences.preconstructionTotal || '₹' + window.surveyResponses?.preconstructionTotal?.[0] || '-';
  }

  // Required Services accordion - dynamic based on selected services
  const summaryNumServices = document.getElementById('summaryNumServices');
  const servicesAccordionContent = document.getElementById('servicesAccordionContent');

  if (summaryNumServices && servicesAccordionContent) {
    // Get selected services from survey responses
    const selectedServices = window.surveyResponses?.selectedServices || [];
    const currentServices = window.currentServices || [];

    if (selectedServices.length > 0) {
      // Show number of selected services
      summaryNumServices.textContent = selectedServices.length + ' Selected';

      // Populate accordion with selected services and their costs using ordered list
      servicesAccordionContent.innerHTML = '<ol class="services-list" id="servicesOrderedList"></ol>';
      const servicesOrderedList = document.getElementById('servicesOrderedList');
      let totalServiceCost = 0;

      // Get services included in the selected offer
      let servicesIncludedInOffer = [];
      if (chosenOfferName && window.currentDiscountOffers) {
        const selectedOffer = window.currentDiscountOffers.find(offer => offer.offer_name === chosenOfferName);
        if (selectedOffer && selectedOffer.details && selectedOffer.details.features) {
          servicesIncludedInOffer = selectedOffer.details.features;
        }
      }

      selectedServices.forEach((selectedService, index) => {
        const serviceData = currentServices.find(service => service.service_id == selectedService.service_id);
        if (serviceData) {
          const unitPrice = parseFloat(serviceData.price) || 0;
          let serviceCost = unitPrice;
          let isPerSqFt = false;

          // Check if service is per sq.ft. (case insensitive)
          if (serviceData.name.toLowerCase().includes('per sq')) {
            // Get total area
            let area = 0;
            if (data.costBreakdown?.areaCalculations?.total_room_area) {
              area = data.costBreakdown.areaCalculations.total_room_area;
            } else if (window.surveyResponses && window.surveyResponses.selectedRooms) {
              const carpetText = document.getElementById('summaryCarpetArea')?.textContent;
              area = parseFloat(carpetText) || 0;
            }
            serviceCost = unitPrice * area;
            isPerSqFt = true;
          }

          // Check if this service is included in the selected offer
          const isIncludedInOffer = servicesIncludedInOffer.some(offerService =>
            serviceData.name.includes(offerService)
          );

          const li = document.createElement('li');
          const capitalizedName = serviceData.name.charAt(0).toUpperCase() + serviceData.name.slice(1).toLowerCase();

          if (isIncludedInOffer) {
            li.textContent = `${capitalizedName} - Included in offer`;
            li.style.color = '#28a745';
            li.style.fontWeight = '500';
          } else {
            // Show price HIDDEN for Web, but available for PDF (via textContent)
            const displayCost = Math.round(serviceCost).toLocaleString();
            li.innerHTML = `${capitalizedName}<span style="display:none"> - Rs. ${displayCost}/-</span>`;
            totalServiceCost += serviceCost;
          }
          servicesOrderedList.appendChild(li);
        }
      });

      // Note: Total service cost is now displayed as a separate detail row outside the accordion
    } else {
      // No services selected
      summaryNumServices.textContent = 'Not Selected';
      servicesAccordionContent.innerHTML = '<ol class="services-list" id="servicesOrderedList"></ol>';
      const servicesOrderedList = document.getElementById('servicesOrderedList');
      const li = document.createElement('li');
      li.textContent = 'Services are not included in this estimate';
      servicesOrderedList.appendChild(li);
    }
  }

  // Design Category
  const summaryDesignCategory = document.getElementById('summaryDesignCategory');
  if (summaryDesignCategory) {
    summaryDesignCategory.textContent = data.designPreferences.selectedCategory || window.surveyResponses?.selectedCategory || '-';
  }

  // Chosen Offer - Only update if it still shows ₹0 (hasn't been updated by service selection)
  const chosenOfferElement = document.getElementById('chosenOffer');
  if (chosenOfferElement) {
    const currentText = chosenOfferElement.textContent;
    const selectedOffer = window.surveyResponses?.selectedOffer;

    // Only update if current text contains ₹0 (meaning it hasn't been updated by updateOfferPrices)
    if (currentText.includes('₹0')) {
      if (selectedOffer && selectedOffer !== 'None') {
        if (typeof selectedOffer === 'object' && selectedOffer.name && selectedOffer.price) {
          chosenOfferElement.textContent = `${selectedOffer.name} - ${selectedOffer.price}`;
        } else if (typeof selectedOffer === 'string') {
          chosenOfferElement.textContent = selectedOffer;
        } else {
          chosenOfferElement.textContent = 'None';
        }
      } else {
        chosenOfferElement.textContent = 'None';
      }
    }
    // If current text doesn't contain ₹0, it means updateOfferPrices already updated it with current pricing
  }



  // Update total estimate (including service costs)
  const safeToLocaleString = (num) => num ? num.toLocaleString() : '0';
  const totalElement = document.querySelector('.total-amount');
  if (totalElement) {
    // Calculate total including service costs
    const baseCost = data.costBreakdown.final_project_cost || 0;

    // Use stored total service cost from survey responses if available
    let totalServiceCost = window.surveyResponses?.totalServiceCost || 0;

    // If not available in survey responses, calculate it
    if (totalServiceCost === 0) {
      const selectedServices = window.surveyResponses?.selectedServices || [];
      const currentServices = window.currentServices || [];

      selectedServices.forEach(selectedService => {
        const serviceData = currentServices.find(service => service.service_id == selectedService.service_id);
        if (serviceData) {
          totalServiceCost += parseFloat(serviceData.price) || 0;
        }
      });
    }

    // Update total service cost display (detail row version only)
    // const totalServiceCostElement = document.getElementById('totalServiceCost');

    // if (totalServiceCostElement) {
    //   totalServiceCostElement.textContent = `${data.currency}${safeToLocaleString(totalServiceCost)}/-`;
    // }

    // const totalCost = baseCost + totalServiceCost;
    // totalElement.textContent = `${data.currency}${safeToLocaleString(totalCost)}`;
  }

  // Update share buttons
  const whatsappBtn = document.querySelector('.btn-whatsapp');
  const emailBtn = document.querySelector('.btn-email');

  if (whatsappBtn) {
    whatsappBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(getCostSummaryText(data))}`;
  }

  if (emailBtn) {
    emailBtn.href = `mailto:?subject=Interior Budget Estimate&body=${encodeURIComponent(getCostSummaryText(data))}`;
  }

  // Update comparison plans (desktop & mobile)
  if (data.costBreakdown && Array.isArray(data.costBreakdown.category_comparisons)) {
    updateComparisonPlans(data.costBreakdown.category_comparisons, data.costBreakdown.currency || '₹');
  }
}


function renderDesignStyles(styles) {
  const desktopNav = document.getElementById('desktopNav');
  const mobileNav = document.getElementById('mobileNav');
  const contentArea = document.querySelector('.dsg-content-area');

  if (!desktopNav || !mobileNav || !contentArea) {
    console.warn('Design style section not found in DOM');
    return;
  }

  // Clear existing static HTML
  desktopNav.innerHTML = '';
  mobileNav.innerHTML = '';
  contentArea.querySelectorAll('.dsg-content-section').forEach(el => el.remove());

  // Loop through and create new style sections
  styles.forEach((style, index) => {
    // ✅ Generate a clean, safe ID (no spaces, lowercase)
    const sectionId = style.title.replace(/\s+/g, '-').toLowerCase();

    // Desktop nav
    const navItemDesktop = document.createElement('div');
    navItemDesktop.className = `dsg-nav-item ${index === 0 ? 'active' : ''}`;
    navItemDesktop.dataset.target = sectionId;
    navItemDesktop.textContent = style.title;
    desktopNav.appendChild(navItemDesktop);

    // Mobile nav
    const navItemMobile = document.createElement('div');
    navItemMobile.className = `dsg-nav-item ${index === 0 ? 'active' : ''}`;
    navItemMobile.dataset.target = sectionId;
    navItemMobile.textContent = style.title;
    mobileNav.appendChild(navItemMobile);

    // Features & thumbnails
    const featureList = style.features?.map(f => `<li class="dsg-feature-item">${f}</li>`).join('') || '';
    const thumbsHtml = style.thumbs?.map(t => `<div class="dsg-thumbnail"><img src="${t}" alt="${style.title}"></div>`).join('') || '';

    // Content section
    const section = document.createElement('div');
    section.className = `dsg-content-section ${index === 0 ? 'active' : ''}`;
    section.id = sectionId;
    section.innerHTML = `
      <div class="dsg-desktop-hero">
        <img src="${style.mainImage}" alt="${style.title}">
      </div>
      <div class="dsg-section-wrapper">
        <div class="dsg-text-group">
          <h3 class="dsg-section-title">${style.title}</h3>
          <p class="dsg-section-desc">${style.description}</p>
          <ul class="dsg-feature-list">${featureList}</ul>
        </div>
        <div class="dsg-image-group">${thumbsHtml}</div>
      </div>
    `;
    contentArea.appendChild(section);
  });

  console.log('✅ Design styles rendered:', styles.length);

  // Reinitialize design style selection and image modal handlers
  setupDesignStyleSelection();
  //setupImageModal();
}


function updateVisibleDesignStyles(styles) {
  // Normalize style titles from the response (e.g. ["Modern Minimalist", "Urban Design"])
  const responseTitles = styles.map(s => s.title.trim().toLowerCase());
  // console.log(styles);
  // Select all desktop + mobile nav items and sections
  const navItems = document.querySelectorAll('.dsg-nav-item');
  const sections = document.querySelectorAll('.dsg-content-section');

  // Hide or show based on whether it exists in the response
  navItems.forEach(item => {
    const target = item.dataset.target?.trim().toLowerCase();
    if (responseTitles.includes(target)) {
      item.style.display = ''; // show
    } else {
      item.style.display = 'none'; // hide
    }
  });

  sections.forEach(section => {
    const sectionId = section.id?.trim().toLowerCase();
    if (responseTitles.includes(sectionId)) {
      section.style.display = ''; // show
    } else {
      section.style.display = 'none'; // hide
    }
  });

  // Ensure at least one visible section is active
  const firstVisibleSection = Array.from(sections).find(sec => sec.style.display !== 'none');
  const firstVisibleNav = Array.from(navItems).find(nav => nav.style.display !== 'none');

  if (firstVisibleSection) {
    sections.forEach(sec => sec.classList.remove('active'));
    firstVisibleSection.classList.add('active');
  }

  if (firstVisibleNav) {
    navItems.forEach(nav => nav.classList.remove('active'));
    firstVisibleNav.classList.add('active');
  }
}

// Process any pending design styles that were cached before app.js loaded
if (window.pendingDesignStyles && Array.isArray(window.pendingDesignStyles)) {
  console.log('Processing pending design styles...');
  updateVisibleDesignStyles(window.pendingDesignStyles);
  delete window.pendingDesignStyles;
}

$(document).on('click', '.room-type-card', function () {
  const selectedInteriorTypeId = $(this).data('type-id');

  // Fetch design styles dynamically after room is selected
  $.ajax({
    url: 'assets/api/getDesigns.php',
    type: 'POST',
    dataType: 'json',
    data: { projectType: selectedInteriorTypeId },
    success: function (response) {
      if (response.styles && Array.isArray(response.styles)) {
        updateVisibleDesignStyles(response.styles);
      } else {
        console.warn('No styles found in response');
      }
    },
    error: function (xhr, status, error) {
      console.error('Error fetching design styles:', error);
    }
  });
});


// pdf generation
async function generatePDF(val, includeHiddenCosts = false) {
  // console.log('generatePDF called with includeHiddenCosts:', includeHiddenCosts);

  // 5-Second Delay for Manual Downloads
  if (val !== 0) {
    let btn = null;
    if (val === 1) {
      btn = document.getElementById('completePurchaseBtn');
    } else {
      btn = document.getElementById('summaryBtnx') || document.getElementById('summaryBtn');
    }

    if (btn) {
      const originalText = btn.innerHTML;
      btn.disabled = true;

      for (let i = 5; i > 0; i--) {
        btn.innerHTML = `<i class="fa fa-clock-o"></i> Starting in ${i}s...`;
        await new Promise(r => setTimeout(r, 1000));
      }

      // Restore button state
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  }

  try {
    if (!window.estimateData) {
      alert('Please generate an estimate first');
      return;
    }

    // Initialize data
    const surveyResponses = window.surveyResponses || {};
    const data = window.estimateData || {};
    // Inject architecture details
    if (surveyResponses && surveyResponses.architectureDetails) {
      data.architectureDetails = surveyResponses.architectureDetails;
    }

    // Validate libraries
    if (typeof window.jspdf === 'undefined') {
      alert('PDF libraries not available. Please refresh and try again.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const docPageHeight = doc.internal.pageSize.height; // Define page height
    const docPageWidth = doc.internal.pageSize.width;

    // --- BRANDING CONFIGURATION ---
    const brand = {
      primary: [211, 47, 47], // #D32F2F (Red)
      secondary: [211, 47, 47], // Use Primary Red as Secondary for now (or separate if needed)
      dark: [51, 51, 51],     // #333333 (Dark Gray)
      light: [100, 100, 100], // #646464 (Light Gray)
      bg: [248, 248, 248],    // #F8F8F8 (Very light gray bg for boxes)
      logo: alacritysLogoBase64
    };

    // Constant Ref ID for this document

    let rd = Math.floor(1000 + Math.random() * 9000);
    var urlx = "https://wa.me/919665017607?text=Hi%21+I%27ve+got+my+claim+code%3A+CLAIM-" + rd + ".+Looking+forward+to+unlocking+my+rewards%21";

    // Configuration for Referral Section
    const config = {
      colors: {
        primary: brand.primary,
        secondary: brand.primary,
        lightBlue: [220, 240, 255],
        lightYellow: [255, 248, 220],
        white: [255, 255, 255]
      },
      urls: {
        referral: 'https://alacritys.in/gift-free-design-consultation/',
        current: urlx,
        claim: urlx
      },
      images: {
        diamond: 'assets/images/2d_diamond.webp',
        checkmark: 'assets/images/checkmark.webp',
        iconTarget: 'assets/images/icon_target.webp',
        iconGift: 'assets/images/icon_gift.webp',
        iconDining: 'assets/images/icon_dining.webp'
      }
    };

    // Generate QR codes
    let referralQRCodeDataURL = null;
    let currentPageQRCodeDataURL = null;
    try {
      if (typeof QRCode !== 'undefined') {
        referralQRCodeDataURL = await QRCode.toDataURL(config.urls.referral);
        currentPageQRCodeDataURL = await QRCode.toDataURL(config.urls.current);
      }
    } catch (err) {
      console.error('Failed to generate QR code:', err);
    }

    const today = new Date();

    const outputRef = `Estimate Ref : AUTO-GEN-${today.getFullYear()}-00${Math.floor(Math.random() * 999)}`;
    const finalRefId = outputRef;
    const finalDateStr = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });


    const layout = {
      leftX: 15,
      rightX: 110,
      width: 180,
      colWidth: 85,
      lineHeight: 6,
      headerH: 30,
      footerH: 20
    };

    // --- HELPER FUNCTIONS ---

    // Utility: Safe get
    const safeGet = (obj, path, defaultValue = 'Not specified') => {
      try {
        const parts = path.split('.');
        let o = obj;
        for (let p of parts) {
          if (o == null || o[p] == null) return defaultValue;
          o = o[p];
        }
        return o || defaultValue;
      } catch (e) { return defaultValue; }
    };

    // Utility: Currency
    const fmtMoney = (num) => {
      if (num === null || num === undefined || isNaN(num)) return '0';
      return parseInt(num).toLocaleString('en-IN');
    };

    const addWhatHappensNextSection = (startY) => {
      let y = startY;

      // Section Title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(200, 50, 38); // Website Red
      doc.text("What Happens Next?", 105, y, { align: 'center' });
      y += 10;

      // Configuration (Compact)
      const stepWidth = 45; // Reduced from 55
      const stepGap = 5;
      const startX = (210 - ((stepWidth * 3) + (stepGap * 2))) / 2; // Exact center
      const iconSize = 16; // Reduced from 25

      // Step configurations
      const steps = [
        {
          number: "Step 1",
          icon: whatsappBase64,
          title: "Connect on WhatsApp",
          description: "Share your received\nestimate summary PDF\nwith us."
        },
        {
          number: "Step 2",
          icon: phoneChatBase64,
          title: "Short Virtual Discussion\nwith Our Designer",
          description: "Have a brief virtual talk to\nclarify your preferences,\nrequirements, and budget."
        },
        {
          number: "Step 3",
          icon: documentBase64,
          title: "Free Design Proposal",
          description: "Receive tailored design ideas and\n a refined estimate within 1–3 days."
        }
      ];

      // Draw connection lines between steps
      doc.setDrawColor(220, 220, 220); // Lighter gray
      doc.setLineWidth(0.5);
      const lineY = y + 10;
      doc.line(startX + stepWidth - 5, lineY, startX + stepWidth + stepGap + 5, lineY);
      doc.line(startX + (stepWidth * 2) + stepGap - 5, lineY, startX + (stepWidth * 2) + (stepGap * 2) + 5, lineY);

      // Draw each step
      steps.forEach((step, index) => {
        const x = startX + (index * (stepWidth + stepGap));
        let stepY = y;

        // Step number (Red, Smaller)
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(211, 47, 47);
        doc.text(step.number, x + stepWidth / 2, stepY, { align: 'center' });
        stepY += 8;

        // Icon (No Circle Border, Centered)
        const centerX = x + stepWidth / 2;
        try {
          // No circle drawing here
          doc.addImage(step.icon, 'PNG', centerX - iconSize / 2, stepY, iconSize, iconSize);
        } catch (e) {
          // Fallback only if image fails
          doc.setFillColor(240, 240, 240);
          doc.circle(centerX, stepY + iconSize / 2, iconSize / 2, 'F');
        }
        stepY += iconSize + 6;

        // Title (Smaller)
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        const titleLines = step.title.split('\n');
        titleLines.forEach(line => {
          doc.text(line, x + stepWidth / 2, stepY, { align: 'center' });
          stepY += 4;
        });
        stepY += 3;

        // Description (Smaller)
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120, 120, 120);
        const descLines = step.description.split('\n');
        descLines.forEach(line => {
          doc.text(line, x + stepWidth / 2, stepY, { align: 'center' });
          stepY += 3.5;
        });
      });

      y += 50; // Reduced height (from 60)

      // Bottom disclaimer
      y += 8; // Increased spacing (Requested)
      doc.setFontSize(13); // Last edit was 13
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 150, 150);
      doc.text("No payment or commitment required at this stage.", 105, y, { align: 'center' });
      y += 5;

      // LARGE WHATSAPP BUTTON (Capsule, Smaller)
      const btnWidth = 70;
      const btnHeight = 11;
      const btnX = (210 - btnWidth) / 2;

      // Green gradient effect
      doc.setFillColor(37, 211, 102);
      doc.roundedRect(btnX, y, btnWidth, btnHeight, btnHeight / 2, btnHeight / 2, 'F');

      // WhatsApp Logo
      const logoSize = 10;
      try {
        doc.addImage(whatsapp48Base64, 'PNG', btnX + 5, y + (btnHeight - logoSize) / 2, logoSize, logoSize);
      } catch (e) { }

      // Button text
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text("Connect on WhatsApp", btnX + 18, y + 7.5);

      // Arrow (Vector - Improved)
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(1.0); // Thicker
      const arrX = btnX + btnWidth - 10; // Moved slightly left
      const arrY = y + 5.5;
      const arrSize = 1.5; // Larger
      doc.line(arrX, arrY - arrSize, arrX + arrSize, arrY);
      doc.line(arrX + arrSize, arrY, arrX, arrY + arrSize);

      // Make button clickable
      const clientFirstName = safeGet(data, 'clientDetails.firstName', 'there');
      const whatsappNumber = '919665017607';
      const whatsappMessage = `Hi ${clientFirstName} 👋\n\nI hope you had a chance to look over the cost estimate summary you generated.\n\nYou can reply here to start a short virtual design discussion and take this forward—`;
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

      doc.link(btnX, y, btnWidth, btnHeight, { url: whatsappURL });

      return y + btnHeight + 2; // Minimal spacing after button
    };

    const addWhyChooseSection = (startY) => {
      let y = startY;

      // Top Separator REMOVED (Layout Fix)
      // y += 10;


      // Title
      doc.setFontSize(14); // Increased to 14
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(200, 50, 38); // Website Red
      doc.text("Why Clients Choose Alacritys?", 105, y, { align: 'center' });
      y += 8;

      // Items
      const items = [
        { icon: trophyBase64, text: "15+ Years\nExperience" },
        { icon: targetBase64, text: "Budget-Smart\nDesign Approach" },
        { icon: handshakeBase64, text: "Transparent\nProcess" },
        { icon: locationBase64, text: "11+ Cities\nPresence" }
      ];

      const marginX = 15;
      const totalWidth = 180;
      const colWidth = totalWidth / 4;
      const iconSize = 10; // Reduced from 14

      items.forEach((item, index) => {
        const x = marginX + (index * colWidth);
        const centerX = x + (colWidth / 2);

        // Icon
        try {
          doc.addImage(item.icon, 'PNG', centerX - (iconSize / 2), y, iconSize, iconSize);
        } catch (e) { }

        // Text
        doc.setFontSize(9); // Reduced from 10
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);

        const textY = y + iconSize + 4; // Reduced gap
        const lines = item.text.split('\n');
        let currentTextY = textY;

        lines.forEach(line => {
          doc.text(line, centerX, currentTextY, { align: 'center' });
          currentTextY += 4; // Reduced line height
        });
      });

      y += 22; // Adjusted to clear content height (22) + gap

      return y;
    };

    // Utility: Add Header
    const addHeader = (pageNum) => {
      // Logo (Left)
      try {
        // Updated Logo Dimensions: 335x77 (Ratio 4.35:1)
        // User requested smaller and shifted left.
        // Width: 50mm, Height: 50/4.35 = ~11.5mm. Position X: 10
        doc.addImage(brand.logo, 'PNG', 10, 8, 50, 11.5);
      } catch (e) {
        // Fallback text if image fails
        doc.setFontSize(20);
        doc.setTextColor(...brand.primary);
        doc.setFont('helvetica', 'bold');
        doc.text("Alacritys", 15, 20);
      }

      // Ref ID & Date (Right)
      doc.setFontSize(10);
      doc.setTextColor(...brand.dark);
      doc.setFont('helvetica', 'normal');

      // Ref ID & Date (Right)
      doc.setFontSize(10);
      doc.setTextColor(...brand.dark);
      doc.setFont('helvetica', 'normal');

      doc.text(finalRefId, 195, 15, { align: 'right' });
      doc.text(finalDateStr, 195, 20, { align: 'right' });

      // Divider
      doc.setDrawColor(200, 200, 200);
      doc.line(15, 26, 195, 26); // Moved up from 32
    };

    // Utility: Add Footer (With WhatsApp - Fixed on all pages)
    // NOTE: totalPages is optional - if not provided, it will be determined automatically
    const addFooter = (currentPage, totalPages = null) => {
      const pageHeight = doc.internal.pageSize.height;
      // Reduced dimensions
      const footerHeight = 40; // Adjusted to 40
      const footerY = pageHeight - footerHeight;

      // Background
      doc.setFillColor(250, 250, 250);
      doc.rect(0, footerY, 210, footerHeight, 'F');

      // Top border line
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.5);
      doc.line(15, footerY, 195, footerY);

      // LEFT COLUMN - WhatsApp CTA (~60%)
      const leftX = 20;
      let leftY = footerY + 8; // Compact padding

      // Heading
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 211, 102); // WhatsApp green
      doc.text("Continue on WhatsApp", leftX, leftY);
      leftY += 5;

      // Subtext
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text("Questions about this estimate or next steps?", leftX, leftY);
      leftY += 4;
      doc.text("We're happy to help.", leftX, leftY);
      leftY += 4;

      // Microcopy
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("A short chat can help refine or optimize this estimate.", leftX, leftY);
      leftY += 4;

      // GREEN WHATSAPP BUTTON WITH LOGO INSIDE
      const btnWidth = 50; // Reduced from 72
      const btnHeight = 9;  // Reduced from 11
      const btnX = leftX;
      const btnY = leftY;

      // Button background (WhatsApp green)
      doc.setFillColor(37, 211, 102);
      doc.roundedRect(btnX, btnY, btnWidth, btnHeight, 2, 2, 'F');

      // WhatsApp Logo INSIDE the button
      try {
        doc.addImage(whatsapp48Base64, 'PNG', btnX + 3, btnY + 1.5, 6, 6);
      } catch (e) {
        // If image fails, continue without logo
      }

      // Button text
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text("Chat on WhatsApp", btnX + 11, btnY + 6);

      // Arrow
      doc.setFontSize(11);
      doc.text(">", btnX + btnWidth - 6, btnY + 6);

      // Make button clickable with WhatsApp link
      const clientFirstName = safeGet(data, 'clientDetails.firstName', 'there');
      const whatsappNumber = '919665017607';
      const whatsappMessage = `Hi ${clientFirstName} 👋\n\nI hope you had a chance to look over the cost estimate summary you generated.\n\nYou can reply here to start a short virtual design discussion and take this forward—`;
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

      doc.link(btnX, btnY, btnWidth, btnHeight, { url: whatsappURL });

      // RIGHT COLUMN - Trust & Legal (~40%)
      const rightX = 125;
      // Shifted up - start higher in footer
      let rightY = footerY + 8;

      // Company name (Line 1)
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(80, 80, 80);
      doc.text("© Alacritys Creations Private Limited", rightX, rightY);
      rightY += 5;

      // WhatsApp in Footer (Line 2 - split into two lines)
      doc.setFontSize(10);
      doc.setTextColor(...brand.primary); // Matching brand color
      doc.text("Start Your Design Discussion on", rightX, rightY);
      rightY += 5;
      doc.text("WhatsApp +919665017607", rightX, rightY);
      rightY += 6;

      // Disclaimer lines
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text("Indicative estimate | Shared for initial discussion only", rightX, rightY);
      rightY += 4;
      doc.text("No Payment or Commitment Required At This Stage.", rightX, rightY);

      // Page number with total pages (format: "Page 1-7")
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      const pageText = totalPages ? `Page ${currentPage}-${totalPages}` : `Page ${currentPage}`;
      // Positioned at bottom right of footer, moved up slightly
      doc.text(pageText, 195, footerY + footerHeight - 3, { align: 'right' });
    };


    const checkPageBreak = (requiredSpace = 20) => {
      const docPageHeight = doc.internal.pageSize.height;
      // Increased from 30 to 55 to accommodate new footer height
      if (y + requiredSpace > docPageHeight - 45) {
        addFooter(pageNum); // Add footer before new page
        doc.addPage();
        pageNum++;
        addHeader(); // Add header to new page
        y = 36;
        return true;
      }
      return false;
    };


    // --- GENERATE CONTENT ---

    // Page 1 Setup
    let pageNum = 1;
    addHeader(pageNum);
    let y = 36; // Further reduced to move content up

    // 1. Title
    doc.setFontSize(18);
    doc.setTextColor(...brand.dark);
    doc.setFont('helvetica', 'bold');
    doc.text("Cost Estimate", 105, y, { align: 'center' });
    y += 6; // Reduced from 7
    doc.setFontSize(12);
    doc.setTextColor(...brand.light);
    doc.setFont('helvetica', 'normal');
    doc.text("(Indicative | Calculator Generated)", 105, y, { align: 'center' });
    y += 8; // Further reduced

    // 2. Welcome Message
    doc.setFontSize(12);
    doc.setTextColor(...brand.primary);
    doc.setFont('helvetica', 'bold');
    doc.text("Welcome to Alacritys", layout.leftX, y);
    y += 8; // Reduced from 7

    doc.setFontSize(10);
    doc.setTextColor(...brand.dark);
    doc.setFont('helvetica', 'normal');
    const welcomeText = "Thank you for using our cost calculator. This estimate is shared to support an initial discussion and help you understand indicative investment ranges for your project.";
    const welcomeSplit = doc.splitTextToSize(welcomeText, layout.width);
    doc.text(welcomeSplit, layout.leftX, y, { lineHeightFactor: 1.5 });
    y += (welcomeSplit.length * 7);

    // Divider
    doc.setDrawColor(220, 220, 220);
    doc.line(15, y, 195, y);
    y += 5; // Further reduced

    // --- TWO COLUMN LAYOUT START ---
    let leftY = y;
    let rightY = y;

    // --- LEFT COLUMN ---

    // Project Summary
    doc.setFontSize(12);
    doc.setTextColor(...brand.primary);
    doc.setFont('helvetica', 'bold');
    doc.text("Project Summary", layout.leftX, leftY);
    leftY += 7;

    doc.setFontSize(10);
    doc.setTextColor(...brand.dark);
    doc.setFont('helvetica', 'normal');

    const pType = safeGet(data, 'clientDetails.projectType', 'Home Interior');
    const area = safeGet(data, 'costBreakdown.areaCalculations.total_room_area', 0);
    const roomsCount = document.getElementById('summaryNumRooms')?.textContent || '0';
    const style = safeGet(data, 'designPreferences.selectedStyle', 'Standard');
    const category = safeGet(data, 'designPreferences.selectedCategory', 'Standard');

    // --- Get Selected Offer Details ---
    let sOfferName = '';

    // 1. Try DOM first (Usually contains formatted "Name (X% OFF)")
    const domOffer = document.getElementById('chosenOffer')?.textContent;
    if (domOffer && domOffer !== 'None' && domOffer.trim() !== '') {
      sOfferName = domOffer.trim();
    } else {
      // 2. Fallback to Data Object
      sOfferName = safeGet(data, 'selectedOffer', '');
    }

    // Clean up "(Services + Name)" format if present using Regex for safety
    // Matches "(Services + " with any spacing, case insensitive
    sOfferName = sOfferName.replace(/^\(Services\s*\+\s*/i, '').replace(/\)$/, '').trim();

    let offerDisplay = (sOfferName && sOfferName !== 'None') ? sOfferName : 'Standard (No Offer)';

    // 3. Attempt to enrich with discount percentage if NOT already present
    if (sOfferName && sOfferName !== 'None' && !offerDisplay.includes('% OFF')) {
      try {
        const normalize = (str) => str ? str.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
        const target = normalize(sOfferName);

        // A. Check window.calculatedOfferTerms (populated after calculations)
        if (window.calculatedOfferTerms) {
          // Try matching by clean name or normalized name (using offerLookup if it was global, but it's local to updateOfferPrices)
          // We'll iterate calculatedOfferTerms keys
          const matchingKey = Object.keys(window.calculatedOfferTerms).find(k => normalize(k) === target);
          if (matchingKey && window.calculatedOfferTerms[matchingKey].term) {
            offerDisplay = `${sOfferName} ${window.calculatedOfferTerms[matchingKey].term}`;
          }
        }

        // B. Fallback: Calculate on the fly from window.currentDiscountOffers
        if (!offerDisplay.includes('% OFF') && window.currentDiscountOffers) {
          const foundOffer = window.currentDiscountOffers.find(o => normalize(o.offer_name) === target || normalize(o.offer_name).includes(target));
          if (foundOffer) {
            const pct = parseInt(foundOffer.discount_percent);
            const term = (pct === 0) ? "" : `(${pct}% OFF)`;
            if (term) offerDisplay = `${sOfferName} ${term}`;
          }
        }
      } catch (e) { console.error('Error matching offer for PDF', e); }
    }

    const summaryItems = [
      `Client Name: ${safeGet(data, 'clientDetails.firstName', 'Valued')} ${safeGet(data, 'clientDetails.lastName', 'Client')}`,
      `Location: ${safeGet(data, 'clientDetails.city', 'Pune')}`,
      `Property Type: ${pType}`,
      `Estimated Area: ${area} sq.ft.`,
      `Rooms Considered: ${roomsCount}`,
      `Preferred Style: ${style}`,
      `Design Category: ${category}`,
      `Selected Offer: ${offerDisplay}`
    ];

    summaryItems.forEach(item => {
      // Wrap text to stay within left column (approx 85mm width)
      // Handles long offer names by splitting into multiple lines
      const lines = doc.splitTextToSize(`•  ${item}`, 85);
      lines.forEach(line => {
        doc.text(line, layout.leftX + 2, leftY);
        leftY += 5;
      });
      leftY += 1; // Minimal spacing between items
    });

    // (Left Column ends here, "Services" moved to bottom full-width section)
    leftY += 3;


    // --- RIGHT COLUMN ---

    // Estimated Investment
    doc.setFontSize(12);
    doc.setTextColor(...brand.primary);
    doc.setFont('helvetica', 'bold');
    doc.text("Estimated Investment (Indicative)", layout.rightX, rightY);
    rightY += 10;

    const totalCost = safeGet(data, 'costBreakdown.final_project_cost', 0);
    let costStr = "Contact for Quote";
    if (totalCost > 0) {
      // Show exact amount as requested
      costStr = `Rs. ${fmtMoney(totalCost)}/-`;
    }

    doc.setFontSize(16);
    doc.setTextColor(...brand.dark);
    doc.setFont('helvetica', 'bold');
    doc.text(costStr, layout.rightX, rightY);
    rightY += 5;

    doc.setFontSize(9);
    doc.setTextColor(...brand.light);
    doc.setFont('helvetica', 'normal');
    const disclaimer = "This estimate is indicative and may vary based on design detailing, materials, and scope finalization.";
    const discSplit = doc.splitTextToSize(disclaimer, layout.colWidth);
    doc.text(discSplit, layout.rightX, rightY, { lineHeightFactor: 1.5 });
    rightY += (discSplit.length * 6) + 3;

    // Disclaimer Box
    doc.setFontSize(8);
    const discBox = "• This estimate is shared for initial understanding. Design development, detailed drawings, and execution services will be proposed separately, if required.\n• This estimate is shared to support an initial discussion and is not a binding offer.";
    const discBoxSplit = doc.splitTextToSize(discBox, layout.colWidth - 5);

    // Calculate dynamic height: lines * line_height + padding
    const boxHeight = (discBoxSplit.length * 5) + 4; // Compact box with tighter line spacing



    doc.text(discBoxSplit, layout.rightX + 3, rightY + 3, { lineHeightFactor: 1.4 });
    rightY += boxHeight;

    // Add line below disclaimer -> REMOVED to avoid double line with section divider below
    // doc.setDrawColor(220, 220, 220);
    // doc.setLineWidth(0.5);
    // doc.line(layout.rightX, rightY, layout.rightX + layout.colWidth, rightY);
    // rightY += 4;

    // Space Coverage Snapshot -> REMOVED from Right Column (Moved to Full Width Section)




    // --- SYNC COLUMNS (Find Max Y) ---
    y = Math.max(leftY, rightY);

    // Divider
    doc.setDrawColor(220, 220, 220);
    doc.line(15, y, 195, y);
    y += 8; // Balanced spacing after divider

    // --- SPACE COVERAGE SNAPSHOT (Full Width) ---
    doc.setFontSize(12);
    doc.setTextColor(...brand.primary);
    doc.setFont('helvetica', 'bold');
    doc.text("Space Coverage Snapshot", layout.leftX, y);
    y += 7;

    doc.setFontSize(9);
    doc.setTextColor(...brand.dark);
    doc.setFont('helvetica', 'normal');

    // Get actual selected rooms
    const selectedRooms = surveyResponses.selectedRooms || {};
    const roomKeys = Object.keys(selectedRooms).filter(k => selectedRooms[k] > 0);

    if (roomKeys.length > 0) {
      // 3-column layout (Full Width: 180mm / 3 = 60mm per col)
      const fullWidth = 180;
      const roomColWidth = fullWidth / 3;
      let roomX = layout.leftX;
      let startRoomY = y;
      let roomCount = 0;

      roomKeys.forEach(room => {
        // Capitalize
        const rName = room.charAt(0).toUpperCase() + room.slice(1);
        doc.text(`• ${rName}`, roomX, y);

        roomCount++;

        if (roomCount % 3 === 0) {
          roomX = layout.leftX; // Reset to start
          y += 6; // New Row
        } else {
          roomX += roomColWidth; // Next Column
        }
      });

      // Adjust y if the last row wasn't completed
      if (roomCount % 3 !== 0) {
        y += 8; // Advance Y if incomplete row
      } else {
        y += 2; // Minor spacing if complete row
      }

    } else {
      doc.text("• Whole Home / Custom", layout.leftX, y);
      y += 8;
    }

    // Customization Note
    doc.setFontSize(8);
    doc.setTextColor(...brand.dark);
    doc.setFont('helvetica', 'italic');
    doc.text("All layouts, features, and finishes are fully customizable after discussion.", layout.leftX, y);
    y += 6;

    y += 1; // Minimal spacing before divider



    // Divider
    doc.setDrawColor(220, 220, 220);
    doc.line(15, y, 195, y);
    y += 6; // Reduced from 6 to shift "Offer & Services Selected" up




    // --- FULL WIDTH: Offer & Services Selected (3-Column Grid) ---
    // Retrieve actual services and offer services
    let serviceItemsList = [];
    let offerServicesList = [];

    const servicesAccordionContent = document.getElementById('servicesOrderedList');
    if (servicesAccordionContent && servicesAccordionContent.children.length > 0) {
      serviceItemsList = Array.from(servicesAccordionContent.children).map(li => {
        let text = li.textContent;
        // Strip price
        return text.replace(/ - .*$/, '').trim();
      });
    }

    const offerServicesAccordionContent = document.getElementById('offerServicesOrderedList');
    if (offerServicesAccordionContent && offerServicesAccordionContent.children.length > 0) {
      offerServicesList = Array.from(offerServicesAccordionContent.children).map(li => {
        let text = li.textContent;
        // Strip price
        return text.replace(/ - .*$/, '').trim();
      });
    }

    // Combine both lists, AVOIDING DUPLICATES
    const allServices = [];
    const serviceSet = new Set();

    // Add offer services first (marked as bold-italic)
    offerServicesList.forEach(service => {
      if (!serviceSet.has(service)) {
        serviceSet.add(service);
        allServices.push({ name: service, isOffer: true });
      }
    });

    // Add standalone services ONLY if not already added
    serviceItemsList.forEach(service => {
      if (!serviceSet.has(service)) {
        serviceSet.add(service);
        allServices.push({ name: service, isOffer: false });
      }
    });

    // Fallback
    if (allServices.length === 0) {
      allServices.push(
        { name: "Initial design consultation", isOffer: false },
        { name: "Space planning", isOffer: false },
        { name: "Design intent", isOffer: false },
        { name: "Cost structuring", isOffer: false }
      );
    }

    // Check for page break before starting this section
    // Assume min height of 50mm
    checkPageBreak(50);

    // Header
    doc.setFontSize(12);
    doc.setTextColor(...brand.primary);
    doc.setFont('helvetica', 'bold');
    doc.text("Offer & Services Selected", layout.leftX, y);
    y += 8;

    const startServiceY = y;
    const minServiceHeight = 45; // Reserved space

    // SMALLER FONT as requested
    doc.setFontSize(8);
    doc.setTextColor(...brand.dark);

    const colWidth = 55; // 3 columns fitting in ~180 width with padding
    const colGap = 5;
    const itemsPerRow = 3;

    for (let i = 0; i < allServices.length; i += itemsPerRow) {
      // Get row items (up to 3)
      const rowItems = allServices.slice(i, i + itemsPerRow);

      // 1. Calculate max height for this row
      let maxRowHeight = 0;
      const rowData = rowItems.map(serviceObj => {
        let name = serviceObj.name;
        // Fix capitalization for 2D/3D
        name = name.replace(/\b2d\b/gi, '2D').replace(/\b3d\b/gi, '3D');

        const text = `• ${name}`;
        const lines = doc.splitTextToSize(text, colWidth);
        const height = lines.length * 4.5; // Approx 4.5mm per line for size 8
        if (height > maxRowHeight) maxRowHeight = height;
        return { lines, height, isOffer: serviceObj.isOffer };
      });

      // Add padding between rows
      // If it's single line, height is ~4.5.
      // We want at least ~6mm row height if single line
      if (maxRowHeight < 6) maxRowHeight = 6;
      else maxRowHeight += 2; // Extra buffer if multi-line

      // Check for page break? (Skipping complex logic, assuming fit or basic flow)
      // Check for page break? (Skipping complex logic, assuming fit or basic flow)
      checkPageBreak(maxRowHeight);

      // 2. Draw Row
      let currentX = layout.leftX;
      rowData.forEach(d => {
        // Set font to bold-italic if it's an offer service
        if (d.isOffer) {
          doc.setFont('helvetica', 'bolditalic');
        } else {
          doc.setFont('helvetica', 'normal');
        }
        doc.text(d.lines, currentX, y);
        currentX += (colWidth + colGap);
      });

      // 3. Move Y
      y += maxRowHeight;
    }

    // Enforce Minimum Height (Keep Space)
    const currentHeight = y - startServiceY;
    if (currentHeight < minServiceHeight) {
      y = startServiceY + minServiceHeight;
    }

    // Add explanatory note about offer services
    doc.setFontSize(7);
    doc.setTextColor(...brand.light);
    doc.setFont('helvetica', 'italic');
    doc.text("* Services in bold-italic are included with your selected offer package", layout.leftX, y);
    y += 5;

    // --- ADMIN ONLY: Detailed Investment Breakdown ---
    if (includeHiddenCosts) {
      y += 2;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...brand.secondary); // Highlight for Admin

      // Fetch values from DOM to ensure accuracy with current state
      let serviceCostTxt = document.getElementById('totalServiceCost')?.textContent || '0';
      let finalAmountTxt = document.getElementById('totalAmountToPay')?.textContent || '0';

      // Sanitize: Replace ₹ or other symbols with 'Rs.' to avoid PDF encoding issues
      const cleanMoney = (val) => {
        return val.replace(/[^\d.,]/g, '').trim();
      };

      serviceCostTxt = `Rs. ${cleanMoney(serviceCostTxt)}/-`;
      finalAmountTxt = `Rs. ${cleanMoney(finalAmountTxt)}/-`;

      doc.text(`[ADMIN] Total Service Investment: ${serviceCostTxt}`, layout.leftX, y);
      y += 6;
      doc.text(`[ADMIN] Final Payout (Post-Offer): ${finalAmountTxt}`, layout.leftX, y);
      y += 6;
    }


    // Divider
    doc.setDrawColor(220, 220, 220);
    doc.line(15, y, 195, y);
    y += 6;

    // --- DETAILED ROOM SPECIFICATIONS (From Page 2) ---
    // (Header moved to after data fetch to prevent duplication)

    // Data Definition (Hardcoded as requested)
    // 1. Fetch Data Dynamically
    let roomFeaturesData = {};
    try {
      // Re-use logic to fetch room features
      // Check if global promise exists (from earlier loading)
      let rawPromise = window.rawRoomFeaturesPromise;

      if (!rawPromise) {
        // console.log('Fetching room features on demand...');
        const selectedCategory = surveyResponses.selectedCategory || 'Standard';
        rawPromise = fetch('assets/api/getRoomFeatures.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            selectedRooms: surveyResponses.selectedRooms || {},
            selectedCategory: selectedCategory,
            selectedStyles: surveyResponses.selectedStyles || [],
            projectType: surveyResponses.projectType
          })
        }).then(res => res.json());
      }

      const response = await rawPromise;
      if (response && response.success && response.roomFeatures) {
        roomFeaturesData = response.roomFeatures;
      }
    } catch (e) {
      console.error("Error fetching room details:", e);
    }


    // 2. Render Details
    const roomKeysSpecs = Object.keys(roomFeaturesData);

    if (roomKeysSpecs.length > 0) {

      // Ensure we start on a new page for Room Specs?
      // Only add page if we are not already at the top of a new page.
      if (y > 60) {
        addFooter(pageNum);
        doc.addPage();
        pageNum++;
        addHeader(pageNum);
        y = 38;
      } else {
        // If we are at the top (e.g. < 60), just ensure we have enough buffer
        y = Math.max(y, 35);
      }

      doc.setFontSize(14);
      doc.setTextColor(...brand.primary);
      doc.setFont('helvetica', 'bold');
      doc.text("Room Specifications", 15, y);
      y += 5;

      roomKeysSpecs.forEach(roomKey => {
        const room = roomFeaturesData[roomKey];
        const features = room.features || [];

        // Filter valid features
        const validFeatures = features.filter(f => {
          return (f.description || f.standard_cat || f.premium_cat || f.luxury_cat);
        });

        if (validFeatures.length > 0) {
          // Check space (Header + 1 item)
          if (y + 30 > docPageHeight - 30) {
            addFooter(pageNum);
            doc.addPage();
            pageNum++;
            addHeader(pageNum);
            y = 45;
          }


          // Room Header (Clean Modern)
          doc.setFontSize(12);
          doc.setTextColor(...brand.primary);
          doc.setFont('helvetica', 'bold');
          const rTitle = roomKey.replace(/_/g, ' ').toUpperCase();
          doc.text(rTitle, 15, y);
          y += 3;
          doc.setDrawColor(...brand.primary);
          doc.setLineWidth(0.5);
          doc.line(15, y, 195, y);
          y += 4; // Reduced from 6


          // Iterate Features
          validFeatures.forEach((feat, index) => {
            const catName = feat.room_item || 'General';
            // Determine description based on selectedCategory
            const selCat = (surveyResponses.selectedCategory || 'Standard').toLowerCase();
            let catKey = 'standard_cat';
            if (selCat === 'premium') catKey = 'premium_cat';
            if (selCat === 'luxury') catKey = 'luxury_cat';

            const desc = feat.description || feat[catKey] || feat.standard_cat || '';

            if (desc) {
              const descLines = doc.splitTextToSize(desc, 180);
              // Calculate dynamic height: Text Height + Padding(12)
              const rowHeight = (descLines.length * 4) + 12;

              if (y + rowHeight > docPageHeight - 30) {
                addFooter(pageNum);
                doc.addPage();
                pageNum++;
                addHeader(pageNum);
                y = 45;
              }


              // Optional: White for odd rows (default paper color)

              // Feature Name
              doc.setFontSize(10);
              doc.setTextColor(...brand.dark);
              doc.setFont('helvetica', 'bold');
              doc.text(catName, 15, y);
              y += 5;

              // Description
              doc.setFontSize(10);
              doc.setTextColor(60, 60, 60); // Slightly lighter for body
              doc.setFont('helvetica', 'normal');
              doc.text(descLines, 15, y);

              y += (descLines.length * 4) + 4;
            }
          });
          y += 5; // Space between rooms
        }
      });
    }



    // --- BOTTOM SECTION (Move to Last Page) ---
    // Force new page as requested for the final marketing section
    addFooter(pageNum);
    doc.addPage();
    pageNum++;
    addHeader(pageNum);
    y = 35; // Start earlier (from 40)

    leftY = y;
    rightY = y;

    // --- WHY CHOOSE ALACRITYS SECTION (Now First) ---
    y = addWhyChooseSection(y);

    // Separator BETWEEN Sections
    y += 4;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(15, y, 195, y); // Full width
    y += 6; // Reduced from 10

    // --- WHAT HAPPENS NEXT SECTION (Now Second) ---
    y = addWhatHappensNextSection(y) + 3; // Minimal spacing before separator

    const promoStartY = y;
    const promoHeight = 80; // Reduced to create more breathing room
    const promoWidth = 180; // Full width (layout.width)

    // Background Fill
    doc.setFillColor(...config.colors.white);
    doc.rect(layout.leftX - 5, promoStartY - 5, promoWidth + 10, promoHeight, 'F');

    const leftColX = layout.leftX;
    const rightColX = layout.rightX; // 110

    // Vertical Divider
    // doc.line(...); // Removed

    // Separator BEFORE Promo Section (Requested)
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(15, promoStartY, 195, promoStartY); // Full width

    let pY = promoStartY + 6; // Start slightly below line

    // --- LAYOUT CONSTANTS ---
    const totalW = promoWidth; // 180
    const colW = totalW / 2; // 90
    const leftCX = layout.leftX + (colW / 2); // 60
    const rightCX = layout.leftX + colW + (colW / 2); // 150

    // COLOR PALETTE
    const COLOR_DARK_BLUE = [15, 31, 61];
    const COLOR_RED = [200, 50, 38];

    // HEADERS - Single Centered Red Heading
    pY += 5; // Small adjustment to shift heading down
    const centerX = layout.leftX + (totalW / 2); // Center of the entire section
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLOR_RED); // Red color
    doc.text('Additional Value You Can Unlock', centerX, pY, { align: 'center' });

    // Red underline
    const headingWidth = doc.getTextWidth('Additional Value You Can Unlock');
    doc.setDrawColor(...COLOR_RED);
    doc.setLineWidth(0.5);
    doc.line(centerX - headingWidth / 2, pY + 1, centerX + headingWidth / 2, pY + 1);

    pY += 12; // Space after heading

    // SUBHEADERS (Reduced Size)
    doc.setFontSize(9); // Reduced from 10
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);
    doc.text('Invite friends & unlock', leftCX, pY, { align: 'center' });
    doc.text('Your Estimate Is Complete', rightCX, pY, { align: 'center' });
    pY += 5; // Reduced
    doc.text('premium lifestyle perks', leftCX, pY, { align: 'center' });
    doc.text('Premium Benefits Await', rightCX, pY, { align: 'center' });
    pY += 10; // Reduced

    // LISTS - Centered with subheading, left-aligned content
    const listLeftX = leftCX - 25; // Shifted right to center with subheading (was -35)
    const listRightX = rightCX - 25; // Shifted right to center with subheading (was -40)

    const leftList = [
      "1 Referral: Luxury Décor Hamper",
      "2 Referrals: Taj Staycation Voucher",
      "3 Referrals: Rewards worth",
      "up to Rs. 1 Lakh on Interiors"
    ];
    const rightList = [
      { t: "Free 3D Design Consultation", i: config.images.iconTarget },
      { t: "Luxury Décor Goodies", i: config.images.iconGift },
      { t: "Taj Dining Vouchers", i: config.images.iconDining }
    ];

    let listY = pY;

    // Draw Left List (centered block, left-aligned text)
    leftList.forEach(item => {
      doc.setFontSize(9); // Reduced from 10
      doc.setTextColor(0, 0, 0);
      // Use standard checkmark
      doc.addImage(config.images.checkmark, 'PNG', listLeftX, listY - 4, 5, 5);
      doc.text(item, listLeftX + 8, listY);
      listY += 8;
    });

    // Draw Right List
    let rListY = pY;
    rightList.forEach(item => {
      doc.addImage(item.i, 'PNG', listRightX, rListY - 4, 5, 5);
      doc.text(item.t, listRightX + 8, rListY);
      rListY += 9;
    });

    // BUTTONS & QR CODES
    const btnY = Math.max(listY, rListY) + 5;
    const btnW = 55;
    const btnH = 12;
    const qrSize = 25;

    const drawActionGroup = (centerX, btnText, url, qrData) => {
      const groupW = btnW + 5 + qrSize;
      const startX = centerX - (groupW / 2);

      // Button
      doc.setFillColor(...COLOR_RED);
      doc.roundedRect(startX, btnY, btnW, btnH, 1, 1, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(btnText, startX + (btnW / 2), btnY + 8, { align: 'center' });
      doc.link(startX, btnY, btnW, btnH, { url: url });

      // QR
      if (qrData) {
        // Align QR bottom with button bottom roughly
        doc.addImage(qrData, 'PNG', startX + btnW + 5, btnY - 7, qrSize, qrSize);
      }
    };

    drawActionGroup(leftCX, "Refer & Earn Now", config.urls.referral, referralQRCodeDataURL);
    drawActionGroup(rightCX, "Claim My Rewards", config.urls.claim, currentPageQRCodeDataURL);

    // Update y to end of section
    y = btnY + 25; // Increased bottom padding







    // This section was moved to the right column above.
    // The original full-width image logic is no longer needed here.
    // The `y` variable will now be determined by `maxY` from the two columns.

    // Final Footer - Re-enabled per user request
    addFooter(pageNum);

    // ==========================================
    // UPDATE ALL PAGE NUMBERS WITH TOTAL PAGES
    // ==========================================
    const totalPages = doc.internal.getNumberOfPages();
    if (totalPages > 1) {
      // Store current page
      const currentPageBackup = doc.internal.getCurrentPageInfo().pageNumber;

      // Loop through all pages and update the page number
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Clear the old page number area (draw white rectangle over it)
        const pageHeight = doc.internal.pageSize.height;
        const footerHeight = 40;
        const footerY = pageHeight - footerHeight;
        doc.setFillColor(250, 250, 250);
        doc.rect(175, footerY + footerHeight - 8, 25, 8, 'F');

        // Draw new page number with total (format: "Page X-Y")
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.text(`Page ${i}-${totalPages}`, 195, footerY + footerHeight - 3, { align: 'right' });
      }

      // Restore to the page we were on
      doc.setPage(currentPageBackup);
    }

    // --- SAVE ---
    const fullName = `${safeGet(data, 'clientDetails.firstName', '')} ${safeGet(data, 'clientDetails.lastName', '')}`.trim();
    const fileName = `${fullName.replace(/[^a-z0-9]/gi, '_') || 'Interior_Design'}_Estimate.pdf`;

    // Wait for data save before downloading
    saveDataForPDFDownload();

    doc.save(fileName);

    // Redirect Logic
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.get('admin_mode')) {
      if (val == 1) window.location = 'assets/thankyou/thanks.html';
      else window.location = 'assets/thankyou/thank-you.html';
    }

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. See console.');
  }
}


// Function to save data when PDF is downloaded (even without completing other actions)
function saveDataForPDFDownload() {
  // Get survey responses
  const surveyData = window.surveyResponses || {};
  const estimateData = window.estimateData || {};

  // Get session ID
  let sessionId = sessionStorage.getItem('session_id') ||
    (window.surveyResponses && window.surveyResponses.sessionId);

  // Fallback: generate a session ID if none is available
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('session_id', sessionId);
  }

  // Get service cost from the estimate section
  const totalServiceCostElement = document.getElementById('totalServiceCost');
  let servicePrice = 0;
  if (totalServiceCostElement) {
    const costText = totalServiceCostElement.textContent.replace(/[₹,]/g, '');
    servicePrice = parseInt(costText) || 0;
  }

  // Get selected services
  const selectedServicesRaw = window.surveyResponses?.selectedServices || [];
  const selectedServices = selectedServicesRaw.map(service => {
    return typeof service === 'object' && service.service_id ? service.service_id : service;
  });

  // Get selected offer text
  let selectedOffer = null;
  let selectedOffer2 = null;
  const chosenOfferElement = document.getElementById('chosenOffer');
  if (chosenOfferElement && chosenOfferElement.textContent !== 'None') {
    selectedOffer = chosenOfferElement.textContent.trim();
    // Clean the text (remove price part if needed)
    if (selectedOffer.includes(' - ')) {
      selectedOffer2 = selectedOffer.split(' - ')[1].trim();
      selectedOffer = selectedOffer.split(' - ')[0].trim();

    }
  }

  // Get cost data
  const costData = estimateData.costBreakdown || surveyData.costBreakdown || {};
  const designData = estimateData.designPreferences || surveyData.designPreferences || {};

  // Ensure firstName and lastName are properly set
  const firstName = surveyData.firstName || '';
  const lastName = surveyData.lastName || '';

  // Prepare data for saving
  const saveData = {
    // Basic survey data
    city: surveyData.city || '',
    firstName: firstName,
    lastName: lastName,
    selectedRooms: surveyData.selectedRooms || {},
    selectedStyles: surveyData.selectedStyles || [],
    selectedDesignStyle: surveyData.selectedDesignStyle || '',
    selectedCategory: surveyData.selectedCategory || '',
    carpetAreas: surveyData.carpetAreas || {},
    selectedServices: selectedServices,
    email: surveyData.email || '',
    phone: surveyData.phone || '',
    pincode: surveyData.pincode || '',
    whatsapp: surveyData.whatsapp || 0,
    countryCode: surveyData.countryCode || '+91',
    q1: surveyData.q1 || '',
    q2: surveyData.q2 || '',
    q3: surveyData.q3 || '',
    q4: surveyData.q4 || '',
    q5: surveyData.q5 || '',
    projectType: surveyData.projectType || 'Home Interior',

    // Pre-calculated cost data
    totalRoomArea: costData.areaCalculations?.total_room_area || 0,
    constructionCost: costData.construction_cost || 0,
    finalProjectCost: costData.final_project_cost || 0,
    baseCosts: costData.baseCosts || {},
    roomDetails: costData.areaCalculations?.rooms || [],
    categoryComparisons: costData.category_comparisons || [],

    // Design preferences
    selectedStyle: designData.selectedStyle || '',
    styleMultiplier: designData.styleMultiplier || 1,
    categoryMultiplier: designData.categoryMultiplier || 1,

    // Service cost
    serviceCost: servicePrice,
    selectedOffer: selectedOffer || null,
    selectedOfferVal: selectedOffer2 || null,

    // Company information
    companyType: surveyData.companyType || 'Individual',
    companyName: surveyData.companyName || null,
    gstNumber: surveyData.gstNumber || null,

    // Carpet areas in JSON format
    carpetAreas: surveyData.carpetAreas || {},

    // Admin Comparison History Data
    adminComparisonData: {
      standard_package_cost: costData.category_comparisons?.[0]?.final_project_cost || 0,
      premium_package_cost: costData.category_comparisons?.[1]?.final_project_cost || 0,
      luxury_package_cost: costData.category_comparisons?.[2]?.final_project_cost || 0,
      selected_offer_name: selectedOffer || null,
      selected_offer_value: selectedOffer2 || 0, // Assuming this holds the discount value or percentage
      final_shown_total: costData.final_project_cost || 0
    },

    // Architecture Details
    architectureDetails: surveyData.architectureDetails || null
  };

  // Call API to save all survey data
  fetch('assets/api/saveAllSurveyData.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(saveData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Data saved successfully when PDF was downloaded');
      } else {
        console.error('Error saving data for PDF download:', data.message);
      }
    })
    .catch(error => {
      console.error('Error saving data for PDF download:', error);
    });
}



// Ensure page scrolls to top on load
window.addEventListener('load', function () {
  window.scrollTo({ top: 0, behavior: 'auto' });
});


// design categories
const packages = [
  {
    tier: "Standard",
    materials: ["Silver MR Ply", "Silver BWR ply", "Pine & Maple wood", "Modi clear & NR glass", "Oman gypsum ceiling", "Godrej & Ebco hardware", "Anchor wiring", "Murphy &equivalent lights"],
    fixtures: ["Matt", "Gloss & Textured laminate", "Regular wood polish", "Lustre paint", "Anchor/ Gold Medal switches", "Lemon Décor/ Zynaa fabric"],
    civil: ['4" brick plaster', "Supreme plumbing", "Johnson CP &sanitary fittings"]
  },
  {
    tier: "Premium",
    materials: ["Gold MR ply", "Sal & Cherry wood", "MDF", "Saint Gobain clear", "NR", "back painted glass", "Boral / Gypcore gypsum ceiling", "Godrej", "Ozone & SNR hardware", "Finolex wiring", "Polycab & equivalent lights", "Regular Home Automation"],
    fixtures: ["PVC", "Acrylic & Above laminates", "Veneer (Rs.85-125)", "Melamine & Gloss wood polish", "Duco & Above paint", "LT/ Polycab switches", "Swayam/ Fab India/ above fabric"],
    civil: ['6 & 4" brick plaster', "Prince plumbing", "Cera & Jaquar CP &      sanitary fittings"]
  },
  {
    tier: "Luxury",
    materials: ["Gold MR ply", " Marine ply", "Cherry & Mahogany wood", "HDF", "Solid surface", "HAI Advanced clear", "NR", "back painted glass", "Gyproc gypsum ceiling", "Godrej & Hettich hardware", "Polycab wiring", "Legero & equivalent lights", "full Premium Automation"],
    fixtures: ["Acrylic+ & Above laminates", "Veneer (Rs.115-150)", "PU & Above wood polish", "Duco", "Royale & Acrylic paint", "LT/ Schneider switches", "Portico/ above fabric"],
    civil: ['6 & 4" brick plaster', "Finolex plumbing", "Cera & Kohler CP & sanitary fittings"]
  },
  {
    tier: "Personalized",
    personalized: true,
    messageTitle: "Customize a package that suits you perfectly",
    messageBody: "Our experts will reach out to adjust the package to your needs."
  }
];

const track = document.getElementById('sliderTrack');
const dots = document.getElementById('sliderDots');
const prev = document.getElementById('prevBtn');
const next = document.getElementById('nextBtn');
let current = 1;
let cardCount = packages.length;

function createCard(pkg) {

  let ico = "";
  if (pkg.tier == "Standard") {
    ico = "assets/images/003-medal.webp";
  }
  else if (pkg.tier == "Premium") {
    ico = "assets/images/001-star.webp";
  }
  else if (pkg.tier == "Luxury") {
    ico = "assets/images/002-diamond.webp";
  }
  else {
    ico = "assets/images/004-medals.webp";
  }

  if (pkg.personalized) {
    return `
      <div class="slider-card" data-tier="Personalized">
        <div class="card-header" style="background: #383838; justify-content: center;">
        <img style="background:#000;" src="${ico}" />
          <h2 style="font-size:1.5rem; font-weight:700; margin-top:25px; color:#fff;">Personalized</h2>
        </div>
        <div class="card-content" style="flex-direction:column; align-items:center; text-align:center; min-height:220px; justify-content:center;">
          <div style="margin: 30px 0 10px 0; font-weight: bold; font-size: 1.1rem;">${pkg.messageTitle}</div>
          <div style="margin-bottom: 30px; color: #222;">${pkg.messageBody}</div>
        </div>
        <button class="select-btn" onclick="
          const message = 'Hi! I\\'m interested in a personalized interior design package. Can you help me customize a package that suits my needs perfectly?';
          const encodedMessage = encodeURIComponent(message);
          window.open('https://wa.me/917387383128?text=' + encodedMessage, '_blank');
        ">Contact on WhatsApp</button>
      </div>`;
  }
  return `
      <div class="slider-card" data-tier="${pkg.tier}">
        <div class="card-header" style="background: #383838; justify-content: center;">
          <img src="${ico}" />
          <h2 style="font-size:1.5rem; font-weight:700; margin-top: 35px; color:#fff;">${pkg.tier}</h2>

        </div>
        <div class="card-content">
          <div class="card-column"><h3>Interior Raw Materials & Lights</h3><span>${pkg.materials.join(', ')}</span></div>
          <div class="card-column"><h3>Interior Finishes & Fixtures</h3><span>${pkg.fixtures.join(', ')}${pkg.finishes && pkg.finishes.length ? ', ' + pkg.finishes.join(', ') : ''}</span></div>
          <div class="card-column"><h3>Civil Materials</h3><span>${pkg.civil.join(', ')}</span></div>
        </div>
        <button class="select-btn">Select ${pkg.tier} Package</button>
      </div>`;
}

function renderCards() {
  const cards = [packages[cardCount - 1], ...packages, packages[0]];
  track.innerHTML = cards.map(createCard).join('');
  dots.innerHTML = packages.map((_, i) => `<span class="slider-dot${i === 0 ? ' active' : ''}" data-index="${i}"></span>`).join('');
  setActive();
  updateSlider(true);
  // Highlight selected design_categories card if present
  const selectedCategoryLS = window.surveyResponses && window.surveyResponses.selectedCategory;
  if (selectedCategoryLS) {
    setTimeout(() => {
      const cards = document.querySelectorAll('#design_categories .slider-card, #design_categories .category-card');
      cards.forEach(card => {
        const tier = card.getAttribute('data-tier');
        const h2 = card.querySelector('h2');
        if ((tier && tier.trim() === selectedCategoryLS) || (h2 && h2.textContent.trim() === selectedCategoryLS)) {
          card.classList.add('selected');
          const selectBtn = card.querySelector('.select-btn, .choose-btn');
          if (selectBtn) selectBtn.classList.add('selected');
        } else {
          card.classList.remove('selected');
          const selectBtn = card.querySelector('.select-btn, .choose-btn');
          if (selectBtn) selectBtn.classList.remove('selected');
        }
      });
    }, 100);
  }
}

function setActive() {
  document.querySelectorAll('.slider-card').forEach((card, i) =>
    card.classList.toggle('active', i === current)
  );
  document.querySelectorAll('.slider-dot').forEach((dot, i) =>
    dot.classList.toggle('active', i === (current - 1))
  );
}

let isAnimating_design = false;
function updateSlider(noAnim) {
  if (isAnimating_design && !noAnim) return;
  isAnimating_design = true;

  // Safety: check if track and its children exist
  if (!track || !track.children || track.children.length === 0) {
    isAnimating_design = false;
    return;
  }
  // Ensure current is within bounds
  if (current < 0 || current >= track.children.length) {
    isAnimating_design = false;
    return;
  }

  const card = track.children[current];
  const container = track.parentElement;
  if (!card || !container) {
    isAnimating_design = false;
    return;
  }
  const cardWidth = card.offsetWidth;
  const containerWidth = container.offsetWidth;
  const offset = card.offsetLeft - (containerWidth / 2) + (cardWidth / 2);

  if (noAnim) {
    track.style.transition = 'none';
    track.style.transform = `translateX(-${offset}px)`;
    setActive();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        track.style.transition = 'var(--transition)';
        isAnimating_design = false;
      });
    });
  } else {
    track.style.transition = 'var(--transition)';
    track.style.transform = `translateX(-${offset}px)`;
    setActive();
    setTimeout(() => isAnimating_design = false, 400);
  }
}

prev.addEventListener('click', () => {
  current = (current - 1 + cardCount + 2) % (cardCount + 2);
  updateSlider();
});

next.addEventListener('click', () => {
  current = (current + 1) % (cardCount + 2);
  updateSlider();
});

dots.addEventListener('click', e => {
  if (e.target.dataset.index) {
    current = (parseInt(e.target.dataset.index) + 1) % (cardCount + 2);
    updateSlider();
  }
});

track.addEventListener('transitionend', () => {
  if (current === 0) {
    current = cardCount;
    updateSlider(true);
  } else if (current === cardCount + 1) {
    current = 1;
    updateSlider(true);
  }
});

// Handle window resize
window.addEventListener('resize', () => {
  updateSlider(true);
});

renderCards();




// Dynamic Compare Section
function populateDynamicCompareSection() {
  // Check if our new dynamic compare section exists
  const dynamicCompareCards = document.getElementById('dynamic-compare-cards');
  if (dynamicCompareCards) {
    // Use the new dynamic compare section implementation
    if (typeof window.populateDynamicCompareSectionNew === 'function') {
      window.populateDynamicCompareSectionNew();
      return;
    }
  }

  // Use the existing updateCompareSectionRooms function if available
  if (typeof updateCompareSectionRooms === 'function') {
    updateCompareSectionRooms();
    return;
  }

  // Use data from survey response if available
  const surveyResponses = window.surveyResponses || {};
  const selectedRooms = surveyResponses.selectedRooms || {};
  const selectedCategory = surveyResponses.selectedCategory || 'Standard';

  // If we have estimate data from the server, use it directly
  if (window.estimateData && window.estimateData.roomFeatures) {
    // Set global raw promise for PDF generation
    window.rawRoomFeaturesPromise = Promise.resolve({
      success: true,
      roomFeatures: window.estimateData.roomFeatures,
      styles: window.estimateData.styles || []
    });

    updateCompareSectionWithRoomFeatures(window.estimateData.roomFeatures, selectedCategory);

    // Also update the compare prices from server data
    if (window.estimateData.costBreakdown && window.estimateData.costBreakdown.category_comparisons) {
      if (typeof updateComparePricesFromServerData === 'function') {
        updateComparePricesFromServerData(window.estimateData.costBreakdown.category_comparisons);
      }
    }
    return;
  }

  // Fallback to API call if no estimate data available
  // Store raw promise globally for reuse by generatePDF
  window.rawRoomFeaturesPromise = fetch('assets/api/getRoomFeatures.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      selectedRooms: selectedRooms,
      selectedCategory: selectedCategory,
      selectedStyles: surveyResponses.selectedStyles || [],
      projectType: surveyResponses.projectType || 'Home Interior'
    })
  })
    .then(response => response.json());

  // Use the promise to update UI
  window.rawRoomFeaturesPromise
    .then(data => {
      if (data.success) {
        updateComparePackageDescriptions();
        updateCompareSectionWithRoomFeatures(data.roomFeatures, selectedCategory);
      }
    })
    .catch(error => {
      console.error('Error fetching room features:', error);
    });
}

function updateCompareSectionWithRoomFeatures(roomFeatures, selectedCategory) {
  // Clear existing features section
  const featuresSection = document.getElementById('features-section');
  if (!featuresSection) return;

  // Clear existing content
  featuresSection.innerHTML = '';

  // Create desktop table
  const desktopTable = document.createElement('div');
  desktopTable.className = 'comparison-table';

  // Create mobile container
  const mobileContainer = document.createElement('div');
  mobileContainer.className = 'mobile-scroll-container';
  mobileContainer.id = 'features-scroll';

  const mobileWrapper = document.createElement('div');
  mobileWrapper.className = 'mobile-scroll-wrapper';

  // Get categories for comparison
  const categories = ['Standard', 'Premium', 'Luxury'];

  // For each selected room, create a row
  Object.keys(roomFeatures).forEach(roomType => {
    const roomData = roomFeatures[roomType];
    const features = roomData.features || [];

    // Create desktop row
    const desktopRow = document.createElement('div');
    desktopRow.className = 'table-row';

    // For each category, create a cell
    categories.forEach((category, index) => {
      // Create desktop cell
      const desktopCell = document.createElement('div');
      desktopCell.className = 'table-cell';

      const desktopFeatureContent = document.createElement('div');
      desktopFeatureContent.className = 'feature-content';

      const desktopRoomTitle = document.createElement('h3');
      desktopRoomTitle.textContent = roomType;
      desktopFeatureContent.appendChild(desktopRoomTitle);

      const desktopFeatureList = document.createElement('ul');

      // Get features for this specific category
      const categoryFeatures = features.map(feature => {
        let featureDescription = '';
        switch (category) {
          case 'Standard':
            featureDescription = feature.standard_cat;
            break;
          case 'Premium':
            featureDescription = feature.premium_cat;
            break;
          case 'Luxury':
            featureDescription = feature.luxury_cat;
            break;
          default:
            featureDescription = feature.standard_cat;
        }
        return {
          ...feature,
          feature_description: featureDescription
        };
      }).filter(feature => feature.feature_description && feature.feature_description.trim() !== '');

      // Add features to desktop list
      categoryFeatures.forEach(feature => {
        const listItem = document.createElement('li');
        listItem.textContent = feature.feature_description;
        desktopFeatureList.appendChild(listItem);
      });

      desktopFeatureContent.appendChild(desktopFeatureList);
      desktopCell.appendChild(desktopFeatureContent);
      desktopRow.appendChild(desktopCell);
    });

    // Add empty cell for personalized
    const personalizedCell = document.createElement('div');
    personalizedCell.className = 'table-cell';
    const personalizedContent = document.createElement('div');
    personalizedContent.className = 'feature-content';
    personalizedCell.appendChild(personalizedContent);
    desktopRow.appendChild(personalizedCell);

    // Add desktop row to table
    desktopTable.appendChild(desktopRow);

    // Create mobile room section for this room
    const mobileRoomSection = document.createElement('div');
    mobileRoomSection.className = 'mobile-room-section';

    const mobileRoomHeader = document.createElement('div');
    mobileRoomHeader.className = 'mobile-room-header';

    const mobileRoomTitle = document.createElement('h2');
    mobileRoomTitle.textContent = roomType;
    mobileRoomHeader.appendChild(mobileRoomTitle);

    mobileRoomSection.appendChild(mobileRoomHeader);

    // Create mobile category cards for this room
    const mobileCategoryCards = document.createElement('div');
    mobileCategoryCards.className = 'mobile-category-cards';

    // For each category, create a mobile card
    categories.forEach(category => {
      const categoryFeatures = features.map(feature => {
        let featureDescription = '';
        switch (category) {
          case 'Standard':
            featureDescription = feature.standard_cat;
            break;
          case 'Premium':
            featureDescription = feature.premium_cat;
            break;
          case 'Luxury':
            featureDescription = feature.luxury_cat;
            break;
          default:
            featureDescription = feature.standard_cat;
        }
        return {
          ...feature,
          feature_description: featureDescription
        };
      }).filter(feature => feature.feature_description && feature.feature_description.trim() !== '');

      const mobileCategoryCard = document.createElement('div');
      mobileCategoryCard.className = 'mobile-category-card';
      mobileCategoryCard.setAttribute('data-category', category.toLowerCase());

      const mobileCategoryHeader = document.createElement('div');
      mobileCategoryHeader.className = 'mobile-category-header';

      const mobileCategoryIcon = document.createElement('div');
      mobileCategoryIcon.className = 'mobile-category-icon';
      switch (category) {
        case 'Standard':
          mobileCategoryIcon.textContent = '🏠';
          break;
        case 'Premium':
          mobileCategoryIcon.textContent = '⭐';
          break;
        case 'Luxury':
          mobileCategoryIcon.textContent = '👑';
          break;
      }
      mobileCategoryHeader.appendChild(mobileCategoryIcon);

      const mobileCategoryTitle = document.createElement('h3');
      mobileCategoryTitle.textContent = category;
      mobileCategoryHeader.appendChild(mobileCategoryTitle);

      mobileCategoryCard.appendChild(mobileCategoryHeader);

      const mobileCategoryFeatures = document.createElement('ul');
      mobileCategoryFeatures.className = 'mobile-category-features';

      categoryFeatures.forEach(feature => {
        const listItem = document.createElement('li');
        listItem.textContent = feature.feature_description;
        mobileCategoryFeatures.appendChild(listItem);
      });

      mobileCategoryCard.appendChild(mobileCategoryFeatures);
      mobileCategoryCards.appendChild(mobileCategoryCard);
    });

    // Add personalized card for this room
    const personalizedMobileCard = document.createElement('div');
    personalizedMobileCard.className = 'mobile-category-card';
    personalizedMobileCard.setAttribute('data-category', 'personalized');

    const personalizedMobileHeader = document.createElement('div');
    personalizedMobileHeader.className = 'mobile-category-header';

    const personalizedMobileIcon = document.createElement('div');
    personalizedMobileIcon.className = 'mobile-category-icon';
    personalizedMobileIcon.textContent = '🎨';
    personalizedMobileHeader.appendChild(personalizedMobileIcon);

    const personalizedMobileTitle = document.createElement('h3');
    personalizedMobileTitle.textContent = 'Personalized';
    personalizedMobileHeader.appendChild(personalizedMobileTitle);

    personalizedMobileCard.appendChild(personalizedMobileHeader);

    const personalizedMobileFeatures = document.createElement('ul');
    personalizedMobileFeatures.className = 'mobile-category-features';

    personalizedMobileCard.appendChild(personalizedMobileFeatures);
    mobileCategoryCards.appendChild(personalizedMobileCard);

    mobileRoomSection.appendChild(mobileCategoryCards);
    mobileWrapper.appendChild(mobileRoomSection);
  });

  // Add tables to features section
  featuresSection.appendChild(desktopTable);
  mobileContainer.appendChild(mobileWrapper);
  featuresSection.appendChild(mobileContainer);

  // Show the features section
  featuresSection.style.display = 'block';

  // Update room symptoms in plan cards
  updatePlanSymptoms(Object.keys(roomFeatures));
}

function updatePlanSymptoms(selectedRoomTypes) {
  let roomTypesList = '';

  if (selectedRoomTypes && selectedRoomTypes.length > 0) {
    roomTypesList = selectedRoomTypes.join(' | ');
  } else {
    roomTypesList = 'No rooms selected';
  }

  // Update desktop plan symptoms
  document.querySelectorAll('.plan-symptoms .symptom').forEach(symptom => {
    symptom.textContent = roomTypesList;
  });
}

// compare section
// Consolidated DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function () {
  // Initialize offer functionality
  // initializeOfferFunctionality();

  // Populate dynamic compare section when page loads
  if (window.surveyResponses && window.surveyResponses.selectedRooms) {
    setTimeout(() => {
      populateDynamicCompareSection();
    }, 1500); // Increased delay to ensure all scripts are loaded
  }

  // For desktop - highlight selected column
  const tableCells = document.querySelectorAll('.comparison-table .table-cell');
  tableCells.forEach(cell => {
    cell.addEventListener('click', function () {
      // Get column index
      const index = Array.from(this.parentNode.children).indexOf(this);

      // Remove active class from all cells in table
      document.querySelectorAll('.comparison-table .table-cell').forEach(c => {
        c.classList.remove('active');
      });

      // Add active class to all cells in this column
      document.querySelectorAll(`.comparison-table .table-row .table-cell:nth-child(${index + 1})`).forEach(c => {
        c.classList.add('active');
      });
    });
  });

  // For mobile - highlight selected card and sync scrolling
  const plansScroll = document.getElementById('plans-scroll');
  const featuresScrolls = document.querySelectorAll('#features-scroll');
  const planCards = document.querySelectorAll('.plan-card');

  // Sync scrolling between all containers
  function syncScroll(scrollSource, scrollTargets) {
    scrollSource.addEventListener('scroll', function () {
      const scrollLeft = this.scrollLeft;
      scrollTargets.forEach(target => {
        target.scrollLeft = scrollLeft;
      });
    });
  }

  // Set up scrolling sync in both directions
  if (plansScroll && featuresScrolls.length > 0) {
    syncScroll(plansScroll, featuresScrolls);
    featuresScrolls.forEach(scroll => {
      syncScroll(scroll, [plansScroll, ...Array.from(featuresScrolls).filter(s => s !== scroll)]);
    });
  }

  planCards.forEach(card => {
    card.addEventListener('click', function () {
      // Remove active class from all cards
      planCards.forEach(c => c.classList.remove('active'));
      // Add active class to clicked card
      this.classList.add('active');
    });
  });

  // Make the plan cards container scrollable with mouse drag
  const setupDragScroll = (container) => {
    if (!container) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
      isDown = false;
    });

    container.addEventListener('mouseup', () => {
      isDown = false;
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    });
  };

  // Set up drag scrolling for all scrollable containers
  setupDragScroll(plansScroll);
  featuresScrolls.forEach(setupDragScroll);

  // Show/Hide features section
  const toggleBtn = document.getElementById('toggle-features');
  const featuresSection = document.getElementById('features-section');

  if (toggleBtn && featuresSection) {
    toggleBtn.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      featuresSection.style.display = isExpanded ? 'none' : 'block';

      const lastColumnCells = featuresSection.querySelectorAll(
        '.table-row .table-cell:last-child, .feature-card:last-child'
      );

      lastColumnCells.forEach(cell => {
        const inner = cell.querySelector('.feature-content') || cell;
        const isEmpty = !inner.textContent.trim();

        if (!isExpanded && isEmpty) {
          // Hide visually empty column
          // cell.style.display = 'none';
          cell.style.visibility = 'hidden';
        } else {
          // Reset if not empty or hiding
          // cell.style.display = '';
          cell.style.visibility = 'visible';
        }
      });

      // Update button text
      const icon = this.querySelector('.toggle-icon');
      if (icon) {
        icon.textContent = isExpanded ? '▼' : '▲';
      }
      this.innerHTML = isExpanded
        ? 'Show More Features <span class="toggle-icon">▼</span>'
        : 'Show Less Features <span class="toggle-icon">▲</span>';
    });
  }

  // Modern Summary Section Functionality
  // Tab switching functionality
  const tabItems = document.querySelectorAll('.tab-item');
  const tabContents = document.querySelectorAll('.tab-content');

  tabItems.forEach(tab => {
    tab.addEventListener('click', function () {
      const targetTab = this.getAttribute('data-tab');

      // Remove active class from all tabs and contents
      tabItems.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Add active class to clicked tab and corresponding content
      this.classList.add('active');
      document.getElementById(targetTab + '-tab').classList.add('active');
    });
  });

  // Dropdown functionality
  const dropdownRows = document.querySelectorAll('.dropdown-row');

  dropdownRows.forEach(row => {
    row.addEventListener('click', function (e) {
      e.stopPropagation();

      // Close other dropdowns
      dropdownRows.forEach(otherRow => {
        if (otherRow !== this) {
          otherRow.classList.remove('active');
        }
      });

      // Toggle current dropdown
      this.classList.toggle('active');
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function () {
    dropdownRows.forEach(row => {
      row.classList.remove('active');
    });
  });

  // Update share buttons to include all cost summary info
  const whatsappBtn = document.querySelector('.btn-whatsapp');
  const emailBtn = document.querySelector('.btn-email');
  const downloadBtn = document.querySelector('.btn-download');
  function updateShareLinks() {
    if (!window.estimateData) return;
    const summaryText = getCostSummaryText(window.estimateData);
    if (whatsappBtn) {
      whatsappBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(summaryText)}`;
    }
    if (emailBtn) {
      emailBtn.href = `mailto:?subject=Interior Budget Estimate&body=${encodeURIComponent(summaryText)}`;
    }
  }
  // Update links when estimateData is set
  const origUpdateCostSummary = window.updateCostSummary;
  window.updateCostSummary = function (data) {
    origUpdateCostSummary.call(this, data);
    updateShareLinks();

    // RESTORE DEFAULT SELECTION (Fix for race condition with populateEstimateData)
    // If we have a local selection but the UI was reset to "None" or mismatched
    const localSelection = window.surveyResponses?.selectedOffer || localStorage.getItem('selected_offer_backup');
    const chosenOfferEl = document.getElementById('chosenOffer');

    if (localSelection && chosenOfferEl && (chosenOfferEl.textContent === 'None' || !chosenOfferEl.textContent)) {
      // console.log('Restoring local offer selection after server update:', localSelection);

      // 1. Restore Sidebar Text
      chosenOfferEl.textContent = localSelection;
      chosenOfferEl.style.color = '#e50215';
      chosenOfferEl.style.fontWeight = 'bold';

      // 2. Refresh other dependent UI (Services, Totals)
      // We use selectCurrentOffer logic but without clicking - just triggering updates
      if (typeof updateOfferDetailsDisplay === 'function') {
        updateOfferDetailsDisplay(localSelection);
      }

      // Trigger generic update to refresh services/totals based on local selection
      if (typeof updateServiceDisplayAndCosts === 'function') {
        updateServiceDisplayAndCosts();
      }

      // Ensure button state is consistent
      if (typeof window.updateChooseBtnState === 'function') {
        window.updateChooseBtnState(localSelection);
      }
    }
  };
  // If estimateData is already set, update links
  if (window.estimateData) updateShareLinks();
  // Download PDF already includes all details, but you can add more if needed

  // Compare show more functionality
  const showMoreBtn = document.querySelector('.compare-showmore-evt');
  const cardInfos = document.querySelectorAll('.card_info');
  const comparePackagesDownArrow = document.getElementById('comparePackagesDownArrow');
  const showLessContainer = document.querySelector('.compare-showless-container');

  let isExpanded = false;

  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', function () {
      isExpanded = !isExpanded;

      if (isExpanded) {
        showMoreBtn.textContent = 'Show Less';
        cardInfos.forEach(info => {
          info.classList.add('active');
        });

        // Add personalized-expanded class to personalized card for fit-content height
        const personalizedCard = document.querySelector('.compare_packages_card .card-icon img[src*="004-medals.webp"]')?.closest('.compare_packages_card');
        if (personalizedCard) {
          personalizedCard.classList.add('personalized-expanded');
        }

        // Show down arrow when expanded
        if (comparePackagesDownArrow) {
          comparePackagesDownArrow.style.display = 'block';
        }
        // Show bottom show less button
        if (showLessContainer) {
          showLessContainer.style.display = 'block';
        }
      } else {
        showMoreBtn.textContent = 'Show More';
        cardInfos.forEach(info => {
          info.classList.remove('active');
        });

        // Remove personalized-expanded class from personalized card
        const personalizedCard = document.querySelector('.compare_packages_card .card-icon img[src*="004-medals.webp"]')?.closest('.compare_packages_card');
        if (personalizedCard) {
          personalizedCard.classList.remove('personalized-expanded');
        }

        // Hide down arrow when collapsed
        if (comparePackagesDownArrow) {
          comparePackagesDownArrow.style.display = 'none';
        }
        // Hide bottom show less button
        if (showLessContainer) {
          showLessContainer.style.display = 'none';
        }
      }
    });
  }

  // Show Less and scroll back functionality
  window.showLessAndScroll = function () {
    // Collapse the cards
    isExpanded = false;
    showMoreBtn.textContent = 'Show More';
    cardInfos.forEach(info => {
      info.classList.remove('active');
    });

    // Remove personalized-expanded class from personalized card
    const personalizedCard = document.querySelector('.compare_packages_card .card-icon img[src*="004-medals.webp"]')?.closest('.compare_packages_card');
    if (personalizedCard) {
      personalizedCard.classList.remove('personalized-expanded');
    }

    // Hide down arrow and show less button
    if (comparePackagesDownArrow) {
      comparePackagesDownArrow.style.display = 'none';
    }
    if (showLessContainer) {
      showLessContainer.style.display = 'none';
    }

    // Scroll back to compare section
    const compareSection = document.querySelector('.compare-packages-section');
    if (compareSection) {
      compareSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Down arrow scroll functionality
  if (comparePackagesDownArrow) {
    comparePackagesDownArrow.addEventListener('click', function () {
      const serviceSection = document.getElementById('service_section');
      if (serviceSection) {
        serviceSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }

  // Payment section functionality
  const headers = document.querySelectorAll('.payment-section-header');
  const collapseElements = document.querySelectorAll('.collapse');

  headers.forEach(header => {
    header.addEventListener('click', function () {
      const targetId = this.getAttribute('data-bs-target');
      const targetCollapse = document.querySelector(targetId);
      const bsTarget = bootstrap.Collapse.getOrCreateInstance(targetCollapse, { toggle: false });

      // If the clicked section is open, close it
      if (targetCollapse.classList.contains('show')) {
        bsTarget.hide();
        return;
      }

      // Otherwise, close all other sections first
      collapseElements.forEach(other => {
        if (other !== targetCollapse && other.classList.contains('show')) {
          bootstrap.Collapse.getOrCreateInstance(other, { toggle: false }).hide();
        }
      });

      // Then open the clicked one
      bsTarget.show();
    });
  });

  // Keep header classes in sync with collapse state
  collapseElements.forEach(collapse => {
    const header = document.querySelector(`[data-bs-target="#${collapse.id}"]`);
    collapse.addEventListener('show.bs.collapse', () => header.classList.remove('collapsed'));
    collapse.addEventListener('hide.bs.collapse', () => header.classList.add('collapsed'));
  });

  // Highlight feature card in mobile view when plan is selected (mobile only)
  function highlightMobileFeatureCards() {
    // Only run on mobile
    if (window.innerWidth > 768) return;
    // Remove all highlights
    document.querySelectorAll('.mobile-category-card').forEach(card => card.classList.remove('active'));
    // Find selected plan in upper section
    const selectedPlan = document.querySelector('.plan-card.active, .plan-card.selected');
    if (!selectedPlan) return;
    const plan = selectedPlan.getAttribute('data-plan');
    if (!plan) return;
    // Highlight all mobile category cards for this plan
    document.querySelectorAll('.mobile-category-card').forEach(card => {
      const category = card.getAttribute('data-category');
      if (category && category.toLowerCase() === plan.toLowerCase()) {
        card.classList.add('active');
      }
    });
  }

  // Listen for plan selection changes (mobile)
  document.querySelectorAll('.plan-card').forEach(card => {
    card.addEventListener('click', function () {
      if (window.innerWidth > 768) return;
      document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      highlightMobileFeatureCards();
    });
  });

  // Also call on load (mobile)
  highlightMobileFeatureCards();
  window.addEventListener('resize', highlightMobileFeatureCards);
});







function updateComparisonPlans(categoryComparisons, currency) {

  // Helper to format currency
  function formatCurrency(value) {
    return currency + Math.round(value).toLocaleString();
  }
  const selectedCategory = window.surveyResponses && window.surveyResponses.selectedCategory && window.surveyResponses.selectedCategory.toLowerCase();
  categoryComparisons.forEach(plan => {
    const key = plan.category_name.toLowerCase(); // "standard", "premium", "luxury"

    // Desktop
    const oldPriceElem = document.getElementById(`plan-old-price-${key}`);
    const discountElem = document.getElementById(`plan-discount-${key}`);
    const priceElem = document.getElementById(`plan-price-${key}`);
    if (oldPriceElem) oldPriceElem.textContent = ''; // No old price since no discount
    if (discountElem) discountElem.textContent = ''; // No discount
    if (priceElem) priceElem.textContent = formatCurrency(plan.final_project_cost);

    // Mobile
    const oldPriceElemMobile = document.getElementById(`plan-old-price-${key}-mobile`);
    const discountElemMobile = document.getElementById(`plan-discount-${key}-mobile`);
    const priceElemMobile = document.getElementById(`plan-price-${key}-mobile`);
    if (oldPriceElemMobile) oldPriceElemMobile.textContent = ''; // No old price since no discount
    if (discountElemMobile) discountElemMobile.textContent = ''; // No discount
    if (priceElemMobile) priceElemMobile.textContent = formatCurrency(plan.final_project_cost);

    // Highlight selected plan/category in comparison table (desktop)
    if (selectedCategory) {
      // Table columns
      const tableCells = document.querySelectorAll(`.comparison-table .table-row .table-cell[data-plan="${key}"]`);
      tableCells.forEach(cell => {
        // Remove any previous label
        const oldLabel = cell.querySelector('.selected-category-label');
        if (oldLabel) oldLabel.remove();
        if (key === selectedCategory) {
          cell.classList.add('selected');
          // Add button if not present
          if (!cell.querySelector('.selected-category-button')) {
            const button = document.createElement('button');
            button.className = 'selected-category-button';
            button.textContent = 'Selected Category';
            button.style.cssText = `
              background: #e50215;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
              margin-top: auto;
              width: 100%;
              z-index: 3;
            `;
            // Make the parent container flex to push button to bottom
            cell.style.display = 'flex';
            cell.style.flexDirection = 'column';
            cell.style.minHeight = '100%';
            cell.appendChild(button);
          }
        } else {
          cell.classList.remove('selected');
          // Remove button if exists
          const existingButton = cell.querySelector('.selected-category-button');
          if (existingButton) existingButton.remove();
        }
      });
      // Mobile cards (use data-plan instead of data-category)
      const planCard = document.querySelector(`.plan-card[data-plan="${key}"]`);
      if (planCard) {
        // Remove any previous button
        const oldButton = planCard.querySelector('.selected-category-button');
        if (oldButton) oldButton.remove();
        if (key === selectedCategory) {
          planCard.classList.add('selected');
          planCard.classList.add('active');
          // Add button if not present
          if (!planCard.querySelector('.selected-category-button')) {
            const button = document.createElement('button');
            button.className = 'selected-category-button';
            button.textContent = 'Selected Category';
            button.style.cssText = `
              background: #e50215;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
              margin-top: auto;
              width: 100%;
              z-index: 3;
            `;
            // Make the parent container flex to push button to bottom
            planCard.style.display = 'flex';
            planCard.style.flexDirection = 'column';
            planCard.style.minHeight = '100%';
            planCard.appendChild(button);
          }
        } else {
          planCard.classList.remove('selected');
        }
      }
    }
  });
}

function getCostSummaryText(data) {
  if (!data || !data.costBreakdown) return '';
  const currency = data.costBreakdown.currency || '₹';
  let summary = '';
  summary += `Interior Budget Estimate\n`;
  summary += `----------------------\n`;
  const fullName = data.clientDetails?.firstName && data.clientDetails?.lastName ?
    `${data.clientDetails.firstName} ${data.clientDetails.lastName}` :
    (data.clientDetails?.name || '');
  summary += `Name: ${fullName}\n`;
  summary += `City: ${data.clientDetails?.city || ''}\n`;
  summary += `Project Type: ${data.clientDetails?.projectType || ''}\n`;
  summary += `Design Category: ${data.designPreferences?.selectedCategory || ''}\n`;
  summary += `Design Style: ${data.designPreferences?.selectedStyle || ''}\n`;
  summary += `Budget Range: ${data.designPreferences?.budgetRange || ''}\n`;
  summary += `Timeline: ${data.designPreferences?.timeline || ''}\n`;
  summary += `Priority: ${data.designPreferences?.priority || ''}\n`;
  summary += `Special Requirements: ${data.designPreferences?.specialRequirements || ''}\n`;
  summary += `\n--- Cost Breakdown ---\n`;
  summary += `Base Construction Cost: ${currency}${data.costBreakdown.baseCosts?.base_construction_cost?.toLocaleString()}/sqft\n`;
  summary += `Total Area: ${data.costBreakdown.areaCalculations?.total_room_area?.toLocaleString()} sqft\n`;
  summary += `Construction Cost: ${currency}${data.costBreakdown.construction_cost?.toLocaleString()}\n`;
  summary += `Service Costs: ${currency}${data.costBreakdown.services?.total_service_cost?.toLocaleString()}\n`;
  summary += `Total Estimate: ${currency}${data.costBreakdown.final_project_cost?.toLocaleString()}\n`;
  if (data.costBreakdown.services?.services?.length) {
    summary += `\nIncluded Services:\n`;
    data.costBreakdown.services.services.forEach(s => {
      summary += `- ${s.service_name}: ${currency}${s.cost?.toLocaleString()}\n`;
    });
  }
  summary += `\nNote: Final quote may vary after site visit and consultation.`;
  return summary;
}



// Add popup HTML to the body if not present
function showProcessingPopup() {
  let popup = document.getElementById('processing-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'processing-popup';
    popup.innerHTML = `<div class="processing-popup-inner">
      <div class='processing-spinner'></div>
      <div class='processing-popup-text'>Calculating your estimate...</div>
    </div>`;
    document.body.appendChild(popup);
  } else {
    popup.querySelector('.processing-popup-inner').innerHTML = `
      <div class='processing-spinner'></div>
      <div class='processing-popup-text'>Calculating your estimate...</div>
    `;
  }
  popup.style.display = 'flex';
}

function hideProcessingPopup() {
  const popup = document.getElementById('processing-popup');
  if (popup) popup.style.display = 'none';
}

// --- Utility: Save and Load surveyResponses to/from localStorage with expiry ---
function saveSurveyResponsesToLocalStorage() {
  const data = {
    value: window.surveyResponses,
    expiry: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days from now
  };
  localStorage.setItem('surveyResponses', JSON.stringify(data));
}

// Utility functions to reduce duplicate code
const utils = {
  // Create back buttons with consistent styling
  createBackButton: function (id, ariaLabel, clickHandler) {
    let backBtn = document.getElementById(id);
    if (!backBtn) {
      backBtn = document.createElement('button');
      backBtn.id = id;
      backBtn.className = 'section-arrow-up-btn';
      backBtn.setAttribute('aria-label', ariaLabel);
      backBtn.style.cssText = 'position: fixed; top: 95px; left: 2px; z-index: 1001; background: #e50215; color: white; border: none; border-radius: 50%; width: 50px; height: 50px; font-size: 20px; cursor: pointer; box-shadow: 0 4px 12px rgba(229, 2, 21, 0.3);';
      backBtn.innerHTML = '&#8592;';
      document.body.appendChild(backBtn);
    }
    backBtn.addEventListener('click', clickHandler);
    backBtn.style.display = 'block';
    return backBtn;
  },

  // Show/hide elements with consistent styling
  showElement: function (selector) {
    const element = document.querySelector(selector);
    if (element) element.style.display = 'block';
  },

  hideElement: function (selector) {
    const element = document.querySelector(selector);
    if (element) element.style.display = 'none';
  },

  showElements: function (selectors) {
    selectors.forEach(selector => this.showElement(selector));
  },

  hideElements: function (selectors) {
    selectors.forEach(selector => this.hideElement(selector));
  },

  // Scroll to element with offset
  scrollToElement: function (selector, offset = 0) {
    const element = document.getElementById(selector);
    if (element) {
      const yOffset = offset;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  },

  // Add touch/swipe functionality to element
  addTouchSwipe: function (element, onSwipeLeft, onSwipeRight, threshold = 50) {
    let touchStartX = 0;
    let touchStartY = 0;

    element.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    element.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      // Only handle horizontal swipes (ignore vertical scrolling)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
        if (diffX > 0 && onSwipeLeft) {
          onSwipeLeft();
        } else if (diffX < 0 && onSwipeRight) {
          onSwipeRight();
        }
      }
    }, { passive: true });
  }
};

// Legacy function for backward compatibility
function createBackButton(id, ariaLabel, clickHandler) {
  return utils.createBackButton(id, ariaLabel, clickHandler);
}



















// Function to populate estimate data from survey responses

let totalServiceCost = 0;
let processedServices = [];
let currentDiscountOffers = [];

// Utility functions (if not already defined elsewhere)
function safeGet(obj, path, defaultValue = 0) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue;
}

function safeToLocaleString(value) {
  return (value || 0).toLocaleString();
}

// This function is called AFTER successful contact form submission to save survey response
function populateEstimateData() {
  let surveyData = window.surveyResponses || {};

  // Fallback: Check localStorage if selectedRooms is missing
  if (!surveyData.selectedRooms || Object.keys(surveyData.selectedRooms).length === 0) {
    console.log('DEBUG: surveyResponses empty, attempting to load from localStorage...');
    const stored = localStorage.getItem('surveyResponses');
    if (stored) {
      try {
        const parsedWrapper = JSON.parse(stored);
        const parsed = parsedWrapper.value || parsedWrapper; // Handle wrapper
        surveyData = { ...parsed, ...surveyData };
        if (parsed.selectedRooms && Object.keys(parsed.selectedRooms).length > 0) {
          surveyData.selectedRooms = parsed.selectedRooms;
        }
        window.surveyResponses = surveyData;
      } catch (e) { console.error('Error parsing localStorage backup', e); }
    }
  }

  // NUCLEAR DOM SCRAPING FALLBACK
  if (!surveyData.selectedRooms || Object.keys(surveyData.selectedRooms).length === 0) {
    console.log('DEBUG: memory still empty, attempting DOM SCRAPING...');
    const domRooms = {};
    const domAreas = {};
    const container = document.getElementById('roomConfigContainer');
    if (container) {
      container.querySelectorAll('.room-checkbox').forEach(cb => {
        if (cb.checked) {
          const rid = cb.id.replace('room_', '');
          const label = cb.parentElement.querySelector('span').textContent.trim();
          const countSpan = document.getElementById('count_' + rid);
          const count = countSpan ? parseInt(countSpan.textContent) : 1;
          domRooms[label] = count;

          const areas = [];
          for (let i = 1; i <= count; i++) {
            const val = document.getElementById(`carpet_${rid}_${i}`)?.value;
            if (val) areas.push(parseInt(val));
          }
          if (areas.length) domAreas[label] = areas;
        }
      });
    }
    if (Object.keys(domRooms).length > 0) {
      console.log('DEBUG: Scraped success:', domRooms);
      surveyData.selectedRooms = domRooms;
      if (Object.keys(domAreas).length) surveyData.carpetAreas = domAreas;
      window.surveyResponses = surveyData;
    }
  }

  const requestData = {
    ...surveyData,
    carpetAreas: surveyData.carpetAreas || {}
  };

  // --- FIX: Ensure selectedServices is a simple array of IDs ---
  if (Array.isArray(requestData.selectedServices)) {
    requestData.selectedServices = requestData.selectedServices.map(s => (typeof s === 'object' && s.service_id) ? s.service_id : s);
  }
  // -----------------------------------------------------------

  // CLEANUP: Ensure architecture details are only sent for House Architecture
  // This prevents stale data from appearing if user switched project types
  // FIX: Relaxed check to handle potential whitespace or slight variations
  if (requestData.projectType && !requestData.projectType.trim().includes('House Architecture') && requestData.projectType != '3') {
    delete requestData.architectureDetails;
  }

  if (requestData.selectedDesignStyle) {
    requestData.selectedStyles = [requestData.selectedDesignStyle];
    delete requestData.selectedDesignStyle;
  }

  delete requestData.totalServiceCost;

  // console.log('=== SENDING SURVEY DATA TO SAVE ===');
  // console.log('Request data rooms:', requestData.selectedRooms);
  // console.log('Request data areas:', requestData.carpetAreas);
  // console.log('Request data style:', requestData.selectedStyles);
  // console.log('Request data to saveSurveyResponse.php:', requestData);
  // console.log('=====================================');

  window.lastSurveyRequestData = requestData;
  fetch('assets/api/saveSurveyResponse.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData)
  })
    .then(response => response.json())
    .then(data => {
      // console.log('=== SURVEY RESPONSE SAVE RESULT ===');
      // console.log('Response from saveSurveyResponse.php:', data);
      // console.log('Success:', data.success);
      // console.log('Message:', data.message);
      if (data.costBreakdown) {
        // console.log('Final Project Cost:', data.costBreakdown.final_project_cost);
        // console.log('Category Comparisons:', data.costBreakdown.category_comparisons);
      }

      // CAPTURE CORRECT SESSION ID
      if (data.sessionId) {
        window.latestServerSessionId = data.sessionId;
        // console.log("Captured Server Session ID:", window.latestServerSessionId);
      }

      // console.log('=====================================');

      if (data.success) {
        window.estimateData = data;

        prefillAccountDetails();

        updateCostSummary(data);

        if (data.costBreakdown?.category_comparisons) {
          updateComparisonPlans(data.costBreakdown.category_comparisons, data.currency || '₹');
          if (typeof updateComparePricesFromServerData === 'function') {
            updateComparePricesFromServerData(data.costBreakdown.category_comparisons);
          }
        }

        // Trigger full data save NOW that estimate data is populated (Async Safe)
        if (typeof saveDataForPDFDownload === 'function') {
          // console.log("Calling saveDataForPDFDownload inside populateEstimateData success...");
          saveDataForPDFDownload();
        }

        const currentCity = surveyData.city || 'mumbai';

        // Return fetch promise to next then
        return fetch('assets/api/getServicesByCity.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ city: currentCity })
        });
      } else {
        console.error('Error in cost calculation:', data.message);
        throw new Error(data.message);
      }
    })
    .then(res => res.json())
    .then(serviceData => {
      // Store city and style rates globally
      if (serviceData.city_rates) window.currentCityRates = serviceData.city_rates;
      if (serviceData.style_rates) window.currentStyleRates = serviceData.style_rates;

      if (serviceData.success && Array.isArray(serviceData.services)) {
        const wanted = [
          'First Site Visit',
          'Site Measurements (after Work Order)',
          '2D Design with Detailed Estimate (per sq.ft.)',
          'Basic 3D Design with Mood Board (per sq.ft.)',
          'Basic Project Coordination (lump sum)',
          'Vendor Alignment (lump sum)',
          'Advanced Quality Drawings (per sq.ft.)',
          'Advanced Vendor Procurement Assistance (lump sum)',
          'Material Quality Audits (per sq.ft.)',
          'Curtain Furnishings (per sq.ft.)',
          'Décor Selection (lump sum)',
          'Intermittent Supervision (per visit)',
          'Full-Time Supervision (per month)',
          'Project Management (lump sum)',
          'Cost Report (lump sum)',
          'Modular Drawings (per sq. ft.)',
          'Basic VR'
        ];

        const totalRoomArea = parseFloat(
          safeGet(window.estimateData, 'costBreakdown.areaCalculations.total_room_area', 0)
        ) || 0;

        totalServiceCost = 0;

        processedServices = serviceData.services
          .filter(service => wanted.includes(service.name))
          .map(service => {
            const basePrice = parseFloat(service.price) || 0;

            let quantity = service.sq ?? null;
            let total = basePrice;

            if (service.name.includes('per sq. ft.') || service.name.includes('per sq.ft.')) {
              quantity = totalRoomArea;
              total = basePrice * quantity;
            } else {
              total = basePrice;
            }

            totalServiceCost += total;

            return {
              ...service,
              price: basePrice,
              sq: quantity,
              totalCost: total
            };
          });

        window.currentServices = processedServices;

        // console.log('Selected Services:', processedServices);
        // console.log('Grand Total Cost:', safeToLocaleString(totalServiceCost));

        let currentDiscountOffers = serviceData.offers || [];
        window.currentDiscountOffers = currentDiscountOffers;
        // console.log('Fetched Offer Discounts:', currentDiscountOffers);

        updateOfferPrices(totalServiceCost, currentDiscountOffers, processedServices);

        // RESTORE DEFAULT SELECTION (Fix for race condition - now with DATA)
        // This is the correct place: after `processedServices` and `currentDiscountOffers` are set.
        const localSelection = window.surveyResponses?.selectedOffer || localStorage.getItem('selected_offer_backup');

        if (localSelection) {
          // console.log('Syncing "Services Included" for offer:', localSelection);
          // Ensure sidebar text is correct (might be redundant but safe)
          const chosenOfferEl = document.getElementById('chosenOffer');
          if (chosenOfferEl && (chosenOfferEl.textContent === 'None' || !chosenOfferEl.textContent)) {
            chosenOfferEl.textContent = localSelection;
            chosenOfferEl.style.color = '#e50215';
            chosenOfferEl.style.fontWeight = 'bold';
          }

          // Force update the services list now that we have data
          if (typeof updateOfferServicesDisplay === 'function') {
            updateOfferServicesDisplay(localSelection, processedServices);
          }

          // Also ensure button state
          if (typeof window.updateChooseBtnState === 'function') {
            window.updateChooseBtnState(localSelection);
          }
        }

        // Critical: Save data AGAIN now that offers are calculated
        if (typeof window.saveDataForPDFDownload === 'function') {
          // console.log("Triggering Final Save with Offers...");
          window.saveDataForPDFDownload();
        }


        const imagesUrl = [
          'assets/images/RequiredServices/Site visit and Consultation - Required Services inside Cost Estimation Tool.png ',
          'assets/images/RequiredServices/Site Measurement & Work Order - Required Services inside Cost Estimation Tool.png',
          'assets/images/RequiredServices/2D Design with Detailed Estimate - Required Services inside Cost Estimation Tool.png',
          'assets/images/RequiredServices/3D Designs with Mood Board - Required Services inside Cost Estimation Tool.png',
          'assets/images/RequiredServices/Furnishings - Required Services inside Cost Estimation Tool.png',
          'assets/images/RequiredServices/Decor - Required Services inside Cost Estimation Tool.png',
          'assets/images/RequiredServices/Intermittent Supervision - Required Services inside Cost Estimation Tool.png',
          'assets/images/RequiredServices/Full-Time Supervision - Required Services inside Cost Estimation Tool.png',
          'assets/images/RequiredServices/Project Management - Required Services inside Cost Estimation Tool.png',
          'assets/images/RequiredServices/Cost Report - Required Services inside Cost Estimation Tool.png'
        ];

        // ProcessedServices is already filtered by 'wanted' list at line 6251
        // So we can just map images to it directly
        const servicesWithImages = processedServices.map((service, idx) => ({
          ...service,
          image: imagesUrl[idx % imagesUrl.length]
        }));

        window.currentServices = servicesWithImages;

        const serviceSection = document.getElementById('service_section');
        if (serviceSection?.style.display !== 'none') {
          requestIdleCallback(() => renderServiceCards(servicesWithImages));
        }
      }

      setTimeout(() => {
        const comparisonSection = document.querySelector('.comparison-section');
        if (comparisonSection) {
          comparisonSection.style.display = 'block';
        }
      }, 100);
    })
    .catch(error => {
      console.error(error);
      showToast('Error calculating cost estimate. Please try again.');
    });
}


function loadSurveyResponsesFromLocalStorage() {
  const item = localStorage.getItem('surveyResponses');
  if (!item) return;
  try {
    const data = JSON.parse(item);
    if (data.expiry && Date.now() < data.expiry && typeof data.value === 'object') {
      // Load survey responses but exclude service and offer selections
      const loadedData = data.value;

      // Initialize surveyResponses with loaded data
      window.surveyResponses = {
        ...loadedData,
        // Reset service and offer selections to prevent payment sections from showing
        selectedServices: [],
        selectedOffer: null,
        totalServiceCost: 0
      };

      // Populate dynamic compare section if rooms are selected
      if (window.surveyResponses.selectedRooms && Object.keys(window.surveyResponses.selectedRooms).length > 0) {
        setTimeout(() => {
          populateDynamicCompareSection();
        }, 1500); // Delay to ensure DOM is ready
      }
    } else {
      localStorage.removeItem('surveyResponses');
    }
  } catch (e) {
    localStorage.removeItem('surveyResponses');
  }
  // Restore House Architecture UI state if needed
  if (typeof toggleHouseArchitectureSection === 'function') {
    toggleHouseArchitectureSection();
  }
}

// Load on page load
loadSurveyResponsesFromLocalStorage();


// Global function to update compare section
window.updateCompareSectionFromApp = function () {
  if (typeof updateCompareSectionRooms === 'function') {
    updateCompareSectionRooms();
  } else {
    populateDynamicCompareSection();
  }
};

// Handle Details Actions - Razorpay Integration
function handleDetailsActions() {
  // Get payment method selection
  const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value || 'card';

  // Get total amount to pay
  const totalAmountElement = document.getElementById('totalAmountToPay');
  let totalAmount = 0;

  if (totalAmountElement) {
    const amountText = totalAmountElement.textContent.replace(/[₹,]/g, '');
    totalAmount = parseInt(amountText) || 0;
  }

  if (totalAmount <= 0) {
    showToast('Please select services and offers before proceeding with payment');
    return;
  }

  // Get selected services from survey responses
  const selectedServicesRaw = window.surveyResponses?.selectedServices || [];
  const selectedServices = selectedServicesRaw.map(service => {
    return typeof service === 'object' && service.service_id ? service.service_id : service;
  });

  // Get selected offers from the current selection
  const selectedOffers = [];
  const chosenOfferElement = document.getElementById('chosenOffer');
  if (chosenOfferElement && chosenOfferElement.textContent !== 'None') {
    // Get the complete offer text
    let offerText = chosenOfferElement.textContent.trim();

    // Decode Unicode characters and normalize spaces
    offerText = offerText.replace(/\\u00a0/g, ' ').replace(/\u00a0/g, ' ');
    offerText = offerText.replace(/\\u2019/g, "'").replace(/\u2019/g, "'");

    // Extract only the offer name (before the dash and price)
    if (offerText.includes(' - ')) {
      offerText = offerText.split(' - ')[0].trim();
    }

    selectedOffers.push(offerText);
  }

  // Get session ID
  let sessionId = sessionStorage.getItem('session_id') ||
    (window.surveyResponses && window.surveyResponses.sessionId);

  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('session_id', sessionId);
  }

  // Get project type
  const projectType = window.surveyResponses?.projectType || 'Home Interior';

  // Prepare order data for Razorpay
  const orderData = {
    session_id: sessionId,
    amount: totalAmount,
    payment_method: paymentMethod,
    project_type: projectType,
    selected_services: selectedServices,
    selected_offers: selectedOffers
  };

  // Create Razorpay order
  fetch('index.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'create_razorpay_order',
      ...orderData
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Initialize Razorpay checkout
        if (window.razorpayIntegration) {
          window.razorpayIntegration.initCheckout({
            order_id: data.order_id,
            amount: data.amount,
            key_id: data.key_id,
            currency: data.currency,
            session_id: sessionId,
            payment_method: paymentMethod
          });
        } else {
          showToast('Payment gateway not loaded. Please refresh the page and try again.');
        }
      } else {
        showToast('Failed to create payment order: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error creating payment order:', error);
      showToast('Failed to initialize payment. Please try again.');
    });
}

// Function to populate billing details with proper state/city mapping
function populateBillingDetails(responses) {
  // Indian city to state mapping
  const cityStateMapping = {
    'mumbai': 'Maharashtra',
    'delhi': 'Delhi',
    'bangalore': 'Karnataka',
    'bengaluru': 'Karnataka',
    'chennai': 'Tamil Nadu',
    'kolkata': 'West Bengal',
    'hyderabad': 'Telangana',
    'pune': 'Maharashtra',
    'ahmedabad': 'Gujarat',
    'surat': 'Gujarat',
    'jaipur': 'Rajasthan',
    'lucknow': 'Uttar Pradesh',
    'kanpur': 'Uttar Pradesh',
    'nagpur': 'Maharashtra',
    'indore': 'Madhya Pradesh',
    'thane': 'Maharashtra',
    'bhopal': 'Madhya Pradesh',
    'visakhapatnam': 'Andhra Pradesh',
    'pimpri': 'Maharashtra',
    'patna': 'Bihar',
    'vadodara': 'Gujarat',
    'ghaziabad': 'Uttar Pradesh',
    'ludhiana': 'Punjab',
    'agra': 'Uttar Pradesh',
    'nashik': 'Maharashtra',
    'faridabad': 'Haryana',
    'meerut': 'Uttar Pradesh',
    'rajkot': 'Gujarat',
    'kalyan': 'Maharashtra',
    'vasai': 'Maharashtra',
    'varanasi': 'Uttar Pradesh',
    'srinagar': 'Jammu and Kashmir',
    'aurangabad': 'Maharashtra',
    'dhanbad': 'Jharkhand',
    'amritsar': 'Punjab',
    'navi mumbai': 'Maharashtra',
    'allahabad': 'Uttar Pradesh',
    'prayagraj': 'Uttar Pradesh',
    'ranchi': 'Jharkhand',
    'howrah': 'West Bengal',
    'coimbatore': 'Tamil Nadu',
    'jabalpur': 'Madhya Pradesh',
    'gwalior': 'Madhya Pradesh',
    'vijayawada': 'Andhra Pradesh',
    'jodhpur': 'Rajasthan',
    'madurai': 'Tamil Nadu',
    'raipur': 'Chhattisgarh',
    'kota': 'Rajasthan',
    'chandigarh': 'Chandigarh',
    'guwahati': 'Assam'
  };

  // Get city from responses
  let userCity = '';
  if (responses.city) {
    userCity = responses.city.toLowerCase().trim();
  }

  // Find correct state based on city
  let correctState = cityStateMapping[userCity] || '';

  // Populate billing fields
  const billingCountry = document.getElementById('payment_billing_country');
  if (billingCountry) {
    billingCountry.value = 'India';
    billingCountry.disabled = true;
    billingCountry.style.backgroundColor = '#f5f5f5';
  }

  const billingPincode = document.getElementById('payment_billing_pincode');
  if (billingPincode && responses.pincode) {
    billingPincode.value = responses.pincode;
    billingPincode.readOnly = true;
    billingPincode.style.backgroundColor = '#f5f5f5';
  }

  const billingCity = document.getElementById('payment_billing_city');
  if (billingCity && responses.city) {
    billingCity.value = responses.city;
    billingCity.readOnly = true;
    billingCity.style.backgroundColor = '#f5f5f5';
  }

  const billingState = document.getElementById('payment_billing_state');
  if (billingState && correctState) {
    billingState.value = correctState;
    billingState.readOnly = true;
    billingState.style.backgroundColor = '#f5f5f5';
  }
}

// JavaScript sticky implementation for payment sidebar
function initializeStickyPaymentSidebar() {

  // Wait a bit for DOM to be ready
  setTimeout(() => {
    const sidebar = document.querySelector('.payment-section .col-md-4');
    const paymentSection = document.querySelector('.payment-section');
    if (!sidebar || !paymentSection) {
      return;
    }

    // Force sticky with CSS
    sidebar.style.cssText = `
      position: sticky !important;
      top: 20px !important;
      height: fit-content !important;
    `;


    // Also try to remove any conflicting styles from parent
    const parentRow = sidebar.closest('.row');
    if (parentRow) {
      parentRow.style.overflow = 'visible';
    }

    const container = sidebar.closest('.container-fluid');
    if (container) {
      container.style.overflow = 'visible';
    }

  }, 500);
}

// Modern Summary Section Functionality
document.addEventListener('DOMContentLoaded', function () {
  // Tab switching functionality
  const tabItems = document.querySelectorAll('.tab-item');
  const tabContents = document.querySelectorAll('.tab-content');

  tabItems.forEach(tab => {
    tab.addEventListener('click', function () {
      const targetTab = this.getAttribute('data-tab');

      // Remove active class from all tabs and contents
      tabItems.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Add active class to clicked tab and corresponding content
      this.classList.add('active');
      document.getElementById(targetTab + '-tab').classList.add('active');
    });
  });

  // Dropdown functionality
  const dropdownRows = document.querySelectorAll('.dropdown-row');

  dropdownRows.forEach(row => {
    row.addEventListener('click', function (e) {
      e.stopPropagation();

      // Close other dropdowns
      dropdownRows.forEach(otherRow => {
        if (otherRow !== this) {
          otherRow.classList.remove('active');
        }
      });

      // Toggle current dropdown
      this.classList.toggle('active');
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function () {
    dropdownRows.forEach(row => {
      row.classList.remove('active');
    });
  });
});

// ... existing code ...
// Highlight feature card in mobile view when plan is selected (mobile only)
function highlightMobileFeatureCards() {
  // Only run on mobile
  if (window.innerWidth > 768) return;
  // Remove all highlights
  document.querySelectorAll('.mobile-category-card').forEach(card => card.classList.remove('active'));
  // Find selected plan in upper section
  const selectedPlan = document.querySelector('.plan-card.active, .plan-card.selected');
  if (!selectedPlan) return;
  const plan = selectedPlan.getAttribute('data-plan');
  if (!plan) return;
  // Highlight all mobile category cards for this plan
  document.querySelectorAll('.mobile-category-card').forEach(card => {
    const category = card.getAttribute('data-category');
    if (category && category.toLowerCase() === plan.toLowerCase()) {
      card.classList.add('active');
    }
  });
}

// Listen for plan selection changes (mobile)
document.querySelectorAll('.plan-card').forEach(card => {
  card.addEventListener('click', function () {
    if (window.innerWidth > 768) return;
    document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    highlightMobileFeatureCards();
  });
});

// Also call on load (mobile)
highlightMobileFeatureCards();
window.addEventListener('resize', highlightMobileFeatureCards);
// ... existing code ...






// offer selection and service slection

let offerSelectedDetails = [];
let chosenOfferName = null; // Track chosen offer name for cancel check

// cost estimate
document.addEventListener('DOMContentLoaded', function () {
  // Offer card selection
  const offerCards = document.querySelectorAll('.offer-card');
  offerCards.forEach(card => {
    card.addEventListener('click', function () {
      // Remove selected class from all cards
      offerCards.forEach(c => c.classList.remove('selected'));
      // Add selected class to clicked card
      this.classList.add('selected');

      // Update button text
      const button = this.querySelector('.offer-button');
      if (button) {
        button.textContent = 'Currently Selected';
      }

      // Reset other buttons
      offerCards.forEach(c => {
        if (c !== this) {
          const btn = c.querySelector('.offer-button');
          if (btn) {
            btn.textContent = 'Choose This Offer';
          }
        }
      });
    });
  });

  // Payment option selection
  const paymentOptions = document.querySelectorAll('.payment-option');
  paymentOptions.forEach(option => {
    option.addEventListener('click', function () {
      const radio = this.querySelector('input[type="radio"]');
      radio.checked = true;
    });
  });

  // Coupon application
  const couponBtn = document.querySelector('.coupon-btn');
  const couponInput = document.querySelector('.coupon-input input');

  if (couponBtn && couponInput) {
    couponBtn.addEventListener('click', function () {
      const code = couponInput.value.trim();
      if (code) {
        alert(`Coupon "${code}" applied successfully!`);
        couponInput.value = '';
      } else {
        alert('Please enter a coupon code');
      }
    });
  }

  // Offer item clicks for details updates only
  const offerItems = document.querySelectorAll('.offer-item');

  // Track last click time to prevent double-click toggle
  let offerClickLock = false; // Add lock variable
  let lastOfferClickTime = 0;
  const OFFER_CLICK_DEBOUNCE = 400;

  offerItems.forEach(item => {
    item.addEventListener('click', function (e) {
      const now = Date.now();

      // Prevent rapid clicks (double-click protection)
      if (offerClickLock || (now - lastOfferClickTime < OFFER_CLICK_DEBOUNCE)) {
        console.log('Offer click blocked - too rapid');
        return;
      }

      // Set lock
      offerClickLock = true;
      lastOfferClickTime = now;

      // Release lock after cooldown
      setTimeout(() => {
        offerClickLock = false;
      }, OFFER_CLICK_DEBOUNCE);

      const detailsSection = document.querySelector(".offer-details-section");
      const planName = this.querySelector('.offer-name').textContent.trim();
      const planPrice = this.querySelector('.offer-price').textContent.trim();

      // Case 1: User clicks the same active card
      if (this.classList.contains('active')) {
        if (chosenOfferName === planName) {
          // Already chosen → ask confirmation before cancel
          if (confirm(`Cancel the selected plan "${planName}"?`)) {
            this.classList.remove('active');
            // if (detailsSection && window.innerWidth >= 768) {
            //   detailsSection.style.display = "none";
            // }
            offerSelectedDetails = [];
            chosenOfferName = null;

            const chosenOfferElement = document.getElementById("chosenOffer");
            if (chosenOfferElement) chosenOfferElement.textContent = '';

            const paymentSelectedOffer = document.getElementById('paymentSelectedOffer');
            if (paymentSelectedOffer) paymentSelectedOffer.textContent = '';

            // Reset offer services display
            const summaryOfferServices = document.getElementById('summaryOfferServices');
            const offerServicesAccordionContent = document.getElementById('offerServicesAccordionContent');
            if (summaryOfferServices) summaryOfferServices.textContent = 'Not Selected';
            if (offerServicesAccordionContent) {
              offerServicesAccordionContent.innerHTML = '<ol class="services-list" id="offerServicesOrderedList"></ol>';
              const offerServicesOrderedList = document.getElementById('offerServicesOrderedList');
              const li = document.createElement('li');
              li.textContent = 'Select an offer to see what services are included in your plan';
              offerServicesOrderedList.appendChild(li);
            }

            // Update service display and costs considering offer inclusions
            updateServiceDisplayAndCosts();

            // Update cost summary to refresh Required Services display
            if (window.estimateData) {
              updateCostSummary(window.estimateData);
            }

            // Check and show payment sections
            checkAndShowPaymentSections();
          }
        } else {
          // Not chosen yet, just deselect (no toast)
          // FIX: Don't hide section on desktop, just deselect the card
          this.classList.remove('active');
          // REMOVED: Hiding details section on desktop causes collapse on double-click
          // if (detailsSection && window.innerWidth >= 768) {
          //   detailsSection.style.display = "none";
          // }
          offerSelectedDetails = [];

          // Reset offer services display
          const summaryOfferServices = document.getElementById('summaryOfferServices');
          const offerServicesAccordionContent = document.getElementById('offerServicesAccordionContent');
          if (summaryOfferServices) summaryOfferServices.textContent = 'Not Selected';
          if (offerServicesAccordionContent) {
            offerServicesAccordionContent.innerHTML = '<ol class="services-list" id="offerServicesOrderedList"></ol>';
            const offerServicesOrderedList = document.getElementById('offerServicesOrderedList');
            const li = document.createElement('li');
            li.textContent = 'Select an offer to see what services are included in your plan';
            offerServicesOrderedList.appendChild(li);
          }

          // Update service display and costs considering offer inclusions
          updateServiceDisplayAndCosts();

          // Update cost summary to refresh Required Services display
          if (window.estimateData) {
            updateCostSummary(window.estimateData);
          }

          // Check and show payment sections
          checkAndShowPaymentSections();
        }
        return;
      }

      // Case 2: Selecting a new card
      offerItems.forEach(i => i.classList.remove('active'));

      if (window.innerWidth >= 0) {
        // Desktop → show section
        this.classList.add('active');
        if (detailsSection) detailsSection.style.display = "block";
        updateOfferDetailsDisplay(planName);
      }

      offerSelectedDetails = [{ name: planName, price: planPrice }];
    });
  });

  // Choose Plan button functionality (both desktop and modal)
  const choosePlanBtns = document.querySelectorAll('.btn-choose-plan');
  choosePlanBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const activeOffer = document.querySelector('.offer-item.active');
      let targetOffer = activeOffer;

      // On mobile, no active until choose, so find by details
      if (!targetOffer && offerSelectedDetails.length > 0) {
        targetOffer = Array.from(document.querySelectorAll('.offer-item'))
          .find(i => i.querySelector('.offer-name').textContent.trim() === offerSelectedDetails[0].name);
        if (targetOffer) targetOffer.classList.add('active');
      }

      if (targetOffer) {
        const planName = targetOffer.querySelector('.offer-name').textContent.trim();
        const planPrice = targetOffer.querySelector('.offer-price').textContent.trim();

        // Calculate Stage 1 price
        const priceMatch = planPrice.match(/₹([\d,]+)/);
        const totalPrice = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0;
        const stage1Price = totalPrice > 25000 ? Math.round(totalPrice * 0.4) : totalPrice;
        const stage1PriceText = `₹${stage1Price.toLocaleString()}/-`;

        chosenOfferName = planName; // mark chosen

        const chosenOfferElement = document.getElementById('chosenOffer');
        if (chosenOfferElement) {
          chosenOfferElement.textContent = `(Services + ${planName})`;
        }

        const paymentSelectedOffer = document.getElementById('paymentSelectedOffer');
        if (paymentSelectedOffer) {
          paymentSelectedOffer.textContent = `(Services + ${planName})`;
        }

        // Update offer services display
        updateOfferServicesDisplay(planName, window.currentServices || []);

        // Update service display and costs considering offer inclusions
        updateServiceDisplayAndCosts();

        // Update cost summary to refresh Required Services display
        if (window.estimateData) {
          updateCostSummary(window.estimateData);
        }

        // Check and show payment sections
        checkAndShowPaymentSections();

        // Close modal if open
        const modal = document.getElementById('offerModal');
        if (modal && modal.classList.contains('active')) {
          closeOfferModal();
        }
      }
    });
  });

  // Add Choose Plan button in modal
  const modalChoosePlanBtn = document.getElementById('choosePlanBtn');
  if (modalChoosePlanBtn) {
    modalChoosePlanBtn.addEventListener('click', function () {
      if (offerSelectedDetails.length > 0) {
        const planName = offerSelectedDetails[0].name;
        const planPrice = offerSelectedDetails[0].price;

        const targetOffer = Array.from(document.querySelectorAll('.offer-item'))
          .find(i => i.querySelector('.offer-name').textContent.trim() === planName);
        if (targetOffer) targetOffer.classList.add('active');

        // Calculate Stage 1 price
        const priceMatch = planPrice.match(/₹([\d,]+)/);
        const totalPrice = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0;
        const stage1Price = totalPrice > 25000 ? Math.round(totalPrice * 0.4) : totalPrice;
        const stage1PriceText = `₹${stage1Price.toLocaleString()}/-`;

        chosenOfferName = planName;

        const chosenOfferElement = document.getElementById('chosenOffer');
        if (chosenOfferElement) {
          chosenOfferElement.textContent = `(Services + ${planName})`;
        }

        const paymentSelectedOffer = document.getElementById('paymentSelectedOffer');
        if (paymentSelectedOffer) {
          paymentSelectedOffer.textContent = `(Services + ${planName})`;
        }

        // Update offer services display
        updateOfferServicesDisplay(planName, window.currentServices || []);

        // Update service display and costs considering offer inclusions
        updateServiceDisplayAndCosts();

        // Update cost summary to refresh Required Services display
        if (window.estimateData) {
          updateCostSummary(window.estimateData);
        }

        // Check and show payment sections
        checkAndShowPaymentSections();

        closeOfferModal();
      }
    });
  }

  // Modal close functionality - using centralized closeOfferModal function
  const offerModalClose = document.getElementById('offerModalClose');
  const offerModal = document.getElementById('offerModal');

  if (offerModalClose) {
    offerModalClose.addEventListener('click', closeOfferModal);
  }

  if (offerModal) {
    offerModal.addEventListener('click', function (e) {
      if (e.target === offerModal) {
        closeOfferModal();
      }
    });
  }

  // Initialize first offer details on page load - wait for offer prices to be calculated
  setTimeout(() => {
    const firstOffer = document.querySelector('.offer-item');
    if (firstOffer) {
      const firstPlanName = firstOffer.querySelector('.offer-name').textContent.trim();

      // Check if offer prices have been calculated (look for price text that's not ₹0)
      const priceText = firstOffer.querySelector('.offer-price').textContent.trim();
      const priceMatch = priceText.match(/₹([\d,]+)/);
      const hasCalculatedPrice = priceMatch && parseInt(priceMatch[1].replace(/,/g, '')) > 0;

      if (hasCalculatedPrice) {
        // Prices are calculated, update details immediately
        updateOfferDetailsDisplay(firstPlanName);
      } else {
        // Wait a bit more for prices to be calculated
        setTimeout(() => {
          updateOfferDetailsDisplay(firstPlanName);
        }, 1000);
      }

      // Show the offer-details-section
      const detailsSection = document.querySelector(".offer-details-section");
      if (detailsSection) {
        detailsSection.style.display = "block";
      }
    }
  }, 1000);

  // Add scroll tracking for offer cards
  const offersGrid = document.querySelector('.offers-grid');

  // Mobile Offer Navigation (Arrows)
  const offerPrevBtn = document.querySelector('.offer-prev');
  const offerNextBtn = document.querySelector('.offer-next');

  if (offerPrevBtn && offerNextBtn && offersGrid) {
    offerPrevBtn.addEventListener('click', () => {
      offersGrid.scrollBy({ left: -300, behavior: 'smooth' }); // Scroll left
    });

    offerNextBtn.addEventListener('click', () => {
      offersGrid.scrollBy({ left: 300, behavior: 'smooth' }); // Scroll right
    });
  }

  if (offersGrid) {
    offersGrid.addEventListener('scroll', function () {
      // FIX: Disable scroll tracking on desktop to prevent hover interference
      if (window.innerWidth > 768) return;
      // ✅ FIX: Only track scroll if no card is actively selected
      const hasActiveCard = document.querySelector('.offer-item.active');
      if (hasActiveCard) {
        // User has selected a card - don't auto-update on scroll
        return;
      }

      const offerItems = document.querySelectorAll('.offer-item');
      const containerRect = this.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let mostVisibleCard = null;
      let maxVisibility = 0;

      offerItems.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const distanceFromCenter = Math.abs(containerCenter - itemCenter);
        const visibility = Math.max(0, 1 - (distanceFromCenter / (itemRect.width / 2)));

        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          mostVisibleCard = item;
        }
      });

      if (mostVisibleCard && maxVisibility > 0.5) {
        const cardName = mostVisibleCard.querySelector('.offer-name').textContent.trim();

        // Update offer details section with the most visible card
        updateOfferDetailsDisplay(cardName);

        // Update offerSelectedDetails for consistency
        const planPrice = mostVisibleCard.querySelector('.offer-price').textContent.trim();
        offerSelectedDetails = [{ name: cardName, price: planPrice }];
      }
    });
  }

  // Pay now button
  const payNowBtn = document.querySelector('#paymentCompleteBtn');
  if (payNowBtn) {
    payNowBtn.addEventListener('click', function () {
      // Get form data
      const companyTypeRaw = document.querySelector('input[name="payment_company_type"]:checked')?.value || 'individual';
      const companyType = companyTypeRaw === 'business' ? 'Business' : 'Individual';
      const companyName = document.getElementById('payment_business_name')?.value || null;
      const gstNumber = document.getElementById('payment_gst_number')?.value || null;
      const couponCode = document.getElementById('paymentCouponCode')?.value || null;
      const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value || 'card';

      // Validate required fields
      if (companyType === 'Business' && (!companyName || !gstNumber)) {
        showToast('Please fill in company name and GST number for business payments.');
        return;
      }

      // Get session ID from survey responses
      const sessionId = window.surveyResponses?.sessionId || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      // Get billing details from form
      const billingAddress = document.getElementById('payment_billing_address')?.value || '';
      const billingPincode = document.getElementById('payment_billing_pincode')?.value || '';
      const billingCity = document.getElementById('payment_billing_city')?.value || '';
      const billingState = document.getElementById('payment_billing_state')?.value || '';

      // Combine billing address information
      let fullAddress = '';
      if (billingAddress) {
        fullAddress = billingAddress;
        if (billingCity) {
          fullAddress += ', ' + billingCity;
        }
        if (billingState) {
          fullAddress += ', ' + billingState;
        }
        if (billingPincode) {
          fullAddress += ' - ' + billingPincode;
        }
      }

      // Prepare data for API
      const paymentData = {
        session_id: sessionId,
        company_type: companyType,
        company_name: companyName,
        gst_number: gstNumber,
        full_address: fullAddress,
        coupon_code: couponCode,
        payment_method: paymentMethod
      };


      // Show processing state
      this.textContent = 'Processing...';
      this.disabled = true;

      // Call payment completion API
      fetch('assets/api/paymentComplete.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            showToast('Payment completed successfully!');

            setTimeout(() => {
              // Hide all content except thank-you
              document.querySelectorAll('.estimate_header, .action-buttons, .comparison-section, .alacrity-services-container, .cost-summary, .offers-section, .payment-section, .custom-action-row, .compare-packages-section').forEach(el => {
                el.style.cssText = 'display: none !important; visibility: hidden !important;';
              });

              // Force hide action-buttons specifically
              document.querySelectorAll('.action-buttons').forEach(el => {
                el.style.cssText = 'display: none !important; visibility: hidden !important;';
              });
              // Hide estimate header image
              // document.querySelectorAll('.estimate_header img').forEach(el => el.style.display = 'none'); //remove no cost img
              document.querySelector('.thank-you').style.display = 'block';

              // Hide the payment back button
              const paymentBackBtn = document.getElementById('paymentBackBtn');
              if (paymentBackBtn) {
                paymentBackBtn.style.display = 'none';
              }

              // Add back button to thank you section using utility function
              createBackButton('thankYouBackBtn', 'Go Back to Payment', function () {
                // Hide thank you section
                document.querySelector('.thank-you').style.display = 'none';

                // Hide payment section
                document.querySelector('.payment-section').style.display = 'none';

                // Show cost estimate/offers sections properly
                document.querySelectorAll('.estimate_header, .cost-summary, .offers-section, .comparison-section, .room-summary-table-wrapper, .total-section, .note, .alacrity-services-container, .compare-packages-section').forEach(el => {
                  el.style.cssText = 'display: block !important; visibility: visible !important;';
                });

                // Show action buttons with grid display
                document.querySelectorAll('.action-buttons, .custom-action-row').forEach(el => {
                  el.style.cssText = 'display: grid !important; visibility: visible !important;';
                });

                // Hide the thank you back button
                this.style.display = 'none';

                // Scroll to bottom where offers/action buttons are
                setTimeout(() => {
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                  });
                }, 100);
              });

              this.textContent = 'Payment Successful!';
              // Scroll to top
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            }, 2000);
          } else {
            showToast('Payment failed: ' + data.message);
            this.disabled = false;
            this.textContent = 'Complete Purchase';
          }
        })
        .catch(error => {
          showToast('Payment failed. Please try again.');
          this.disabled = false;
          this.textContent = 'Complete Purchase';
        });
    });
  }
  // Hide payment and thank-you by default
  document.querySelector('.thank-you').style.display = 'none';

  // Force hide payment sections immediately on page load
  const paymentSections = [
    '.coupon-section',
    '.payment-method-section',
    '.complete-purchase-section',
    '.terms-section'
  ];

  paymentSections.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.display = 'none';
    }
  });

  // Initialize offer services display with default message
  const summaryOfferServices = document.getElementById('summaryOfferServices');
  const offerServicesAccordionContent = document.getElementById('offerServicesAccordionContent');
  if (summaryOfferServices && offerServicesAccordionContent) {
    summaryOfferServices.textContent = 'Not Selected';
    offerServicesAccordionContent.innerHTML = '<ol class="services-list" id="offerServicesOrderedList"></ol>';
    const offerServicesOrderedList = document.getElementById('offerServicesOrderedList');
    const li = document.createElement('li');
    li.textContent = 'Select an offer to see what services are included in your plan';
    offerServicesOrderedList.appendChild(li);
  }

  // Force reset any cached selections on page load
  if (!window.surveyResponses) {
    window.surveyResponses = {};
  }
  if (!window.surveyResponses.selectedServices) {
    window.surveyResponses.selectedServices = [];
  }

  // Reset offer selection variables to prevent payment sections from showing
  chosenOfferName = null;
  offerSelectedDetails = [];

  // Ensure chosenOfferName is null if no offer is actually selected
  if (chosenOfferName && !document.querySelector('.offer-item.active')) {
    chosenOfferName = null;
  }

  // Check and show/hide payment sections on page load
  checkAndShowPaymentSections();

  // Ensure payment sections are hidden by default on page load
  setTimeout(() => {
    checkAndShowPaymentSections();
  }, 100);

  // Initialize total amount to pay on page load
  updateTotalAmountToPay();
});

// Function to update total amount to pay based on selected services and offers
function updateTotalAmountToPay() {
  const totalAmountElement = document.getElementById('totalAmountToPay');
  if (!totalAmountElement) return;

  let totalAmount = 0;
  let description = '';

  // Get service cost directly from Total Service Cost display
  let serviceCost = 0;
  const totalServiceCostElement = document.getElementById('totalServiceCost');
  if (totalServiceCostElement) {
    const costText = totalServiceCostElement.textContent.replace(/[₹,]/g, '');
    serviceCost = parseInt(costText) || 0;
  }

  let precost = 0;
  const totalProCostElement = document.getElementById('precost');
  if (totalProCostElement) {
    const costText = totalServiceCostElement.textContent.replace(/[₹,]/g, '');
    precost = parseInt(costText) || 0;
  }


  // Get offer cost (use Stage 1 price)
  let offerCost = 0;
  let offerName = '';
  if (window.chosenOfferName) {
    const activeOffer = document.querySelector('.offer-item.active');
    if (activeOffer) {
      const priceText = activeOffer.querySelector('.offer-price').textContent.trim();
      // Extract price from text like "₹21,463/- (20% OFF)"
      const priceMatch = priceText.match(/₹([\d,]+)/);
      if (priceMatch) {
        const totalPrice = parseInt(priceMatch[1].replace(/,/g, '')) || 0;
        // Use Stage 1 price: 40% if > 25k, otherwise full price
        offerCost = totalPrice > 25000 ? Math.round(totalPrice * 0.4) : totalPrice;
        offerName = window.chosenOfferName;
      }
    }
  }

  // Calculate total and set description
  if (serviceCost > 0 && offerCost > 0) {
    // Both selected - add both amounts
    totalAmount = serviceCost + offerCost;
    description = `₹${totalAmount.toLocaleString()}/- (Services + ${offerName})`;
  } else if (serviceCost > 0) {
    // Only services selected
    totalAmount = serviceCost;
    description = `₹${totalAmount.toLocaleString()}/- (Services)`;
  } else if (offerCost > 0) {
    // Only offer selected
    totalAmount = offerCost;
    description = `₹${totalAmount.toLocaleString()}/- (Services + ${offerName})`;
  } else {
    // Nothing selected
    totalAmount = 0;
    description = '₹0';
  }

  if (precost > 0) {
    // Only offer selected
    totalAmount = totalAmount + precost;
  }

  totalAmountElement.textContent = description;


  document.querySelectorAll("li").forEach(li => {
    li.innerHTML = li.innerHTML.replace(/\b2d\b/g, "2D");
  });
  document.querySelectorAll("li").forEach(li => {
    li.innerHTML = li.innerHTML.replace(/\b3d\b/g, "3D");
  });

  // console.log('Total Amount Updated:', { serviceCost, offerCost, totalAmount, description });
}

// Function to update service display and calculate costs considering offer inclusions
function updateServiceDisplayAndCosts() {
  const selectedServices = window.surveyResponses?.selectedServices || [];
  const currentServices = window.currentServices || [];

  if (selectedServices.length === 0) {
    // No services selected - reset displays
    const totalServiceCostElement = document.getElementById('totalServiceCost');
    if (totalServiceCostElement) {
      totalServiceCostElement.textContent = '₹0';
    }
    return;
  }

  // Get services included in the selected offer
  let servicesIncludedInOffer = [];

  // Find the current offer object from global backend data
  const offerObj = window.currentDiscountOffers ? window.currentDiscountOffers.find(o => o.offer_name === chosenOfferName) : null;

  if (offerObj && offerObj.details && offerObj.details.features) {
    servicesIncludedInOffer = offerObj.details.features || [];
  }


  // Calculate total room area for sq ft calculations
  const totalRoomArea = parseFloat(
    safeGet(window.estimateData, 'costBreakdown.areaCalculations.total_room_area', 0)
  ) || 0;

  let totalServiceCost = 0;
  let processedServices = [];

  selectedServices.forEach(selectedService => {
    const serviceData = currentServices.find(service => service.service_id == selectedService.service_id);
    if (!serviceData) return;

    const basePrice = parseFloat(serviceData.price) || 0;
    let quantity = serviceData.sq ?? null;
    let total = basePrice;

    // Calculate cost based on sq ft or direct price
    if (serviceData.name?.includes("per sq. ft.")) {
      quantity = totalRoomArea;
      total = basePrice * quantity;
    } else {
      total = basePrice;
    }

    // Check if this service is included in the selected offer
    const isIncludedInOffer = servicesIncludedInOffer.some(offerService =>
      serviceData.name.includes(offerService)
    );

    // Only add to total cost if NOT included in offer
    if (!isIncludedInOffer) {
      totalServiceCost += total;
    }

    processedServices.push({
      service_id: serviceData.service_id,
      name: serviceData.name,
      price: basePrice,
      sq: quantity,
      totalCost: total,
      isIncludedInOffer: isIncludedInOffer
    });
  });

  // Update total service cost display
  const totalServiceCostElement = document.getElementById('totalServiceCost');
  if (totalServiceCostElement) {
    totalServiceCostElement.textContent = `₹${totalServiceCost.toLocaleString()}/-`;
  }

  // console.log('Service display updated:', {
  //   selectedServices: selectedServices.length,
  //   includedInOffer: servicesIncludedInOffer,
  //   totalServiceCost,
  //   processedServices
  // });


  document.querySelectorAll("li").forEach(li => {
    li.innerHTML = li.innerHTML.replace(/\b2d\b/g, "2D");
  });

  document.querySelectorAll("li").forEach(li => {
    li.innerHTML = li.innerHTML.replace(/\b3d\b/g, "3D");
  });
}

// Function to check and show/hide payment sections
function checkAndShowPaymentSections() {
  const hasSelectedOffer = chosenOfferName !== null;
  // const hasSelectedServices = window.surveyResponses?.selectedServices && window.surveyResponses.selectedServices.length > 0;

  // console.log('Payment sections check:', {
  //   hasSelectedOffer,
  //   chosenOfferName
  // });

  // Only target specific payment-related elements
  const couponSection = document.querySelector('.coupon-section');
  const paymentMethodSection = document.querySelector('.payment-method-section');
  const completePurchaseSection = document.querySelector('.complete-purchase-section');
  const termsSection = document.querySelector('.terms-section');

  // 1. Download Button (Complete Purchase) & Terms -> ONLY if OFFER is selected
  // User Requirement: "download button should come after selecting one offer service"
  if (hasSelectedOffer) {
    if (completePurchaseSection) completePurchaseSection.style.display = 'block';
    if (termsSection) termsSection.style.display = 'block';
  } else {
    if (completePurchaseSection) completePurchaseSection.style.display = 'none';
    if (termsSection) termsSection.style.display = 'none';
  }

  // 2. Payment & Coupon Sections -> ALWAYS HIDDEN
  // User Requirement: "payment section shouldn't come"
  if (couponSection) couponSection.style.display = 'none';
  if (paymentMethodSection) paymentMethodSection.style.display = 'none';

  // Update total amount to pay
  updateTotalAmountToPay();
}

// Refresh button logic (unchanged) ...
document.querySelectorAll('.custom-btn.secondary').forEach(btn => {
  btn.addEventListener('click', function () {
    localStorage.removeItem('surveyResponses');
    window.surveyResponses = {};
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.replace(window.location.href);
  });

});




function updateOfferPrices(totalServiceCost, currentDiscountOffers, processedServices) {
  // console.log('Selected Services:', processedServices);
  // console.log('Fetched Offer Discounts:', currentDiscountOffers);

  // Early exit if offers not loaded
  if (!Array.isArray(currentDiscountOffers) || currentDiscountOffers.length === 0) {
    console.warn("⚠️ No discount offers available yet - skipping calculation.");
    return;
  }

  const offer2 = [];
  const discountValues = [];
  currentDiscountOffers.forEach(offer => {
    offer2.push(offer.offer_name);
    discountValues.push(offer.discount_percent);
  });

  // Helper to normalize names for robust matching (strip all non-alphanumeric)
  const normalizeOfferName = (str) => {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  // Build offer details map with normalized keys for easier lookup
  const normalizedOfferDetails = {};
  if (window.currentDiscountOffers && Array.isArray(window.currentDiscountOffers)) {
    window.currentDiscountOffers.forEach(offer => {
      normalizedOfferDetails[normalizeOfferName(offer.offer_name)] = offer.details || {};
    });
  }

  // Build terms per offer
  const offerTerms = {};
  const offerLookup = {};

  offer2.forEach((name, idx) => {
    const cleanName = name ? name.trim() : '';
    const normName = normalizeOfferName(cleanName);
    const discount = discountValues[idx] / 100;

    // find only relevant services
    // Lookup using normalized name to handle apostrophes/spaces robustly
    const details = normalizedOfferDetails[normName];

    // Fallback features if lookup fails (shouldn't happen with normalization)
    const features = details?.features || [];

    const includedServices = processedServices.filter(service =>
      features.some(f => service.name.includes(f))
    );

    // sum included costs
    let subtotal = 0;
    includedServices.forEach(service => {
      if (service.sq && service.price) {
        subtotal += service.sq * service.price;
      } else {
        subtotal += service.totalCost || service.price || 0;
      }
    });

    const discountedPrice = Math.round(subtotal * (1 - discount));

    const termData = {
      price: discountedPrice,
      term: discount === 0 ? "(Full Payment)" : `(${discountValues[idx]}% OFF)`
    };

    // Store ONLY the clean name in the object destined for the DB
    offerTerms[cleanName] = termData;

    // Store both keys in the lookup map for frontend display logic
    offerLookup[cleanName] = termData;
    offerLookup[normName] = termData;

    // console.log(`Calculated Offer [${cleanName}]:`, termData);
  });

  // STORE AND SAVE ENHANCED DATA
  window.calculatedOfferTerms = offerTerms;
  // console.log("Global calculatedOfferTerms UPDATED:", window.calculatedOfferTerms);

  if (typeof saveEnhancedData === 'function') {
    saveEnhancedData();
  } else {
    // console.warn("saveEnhancedData function missing, creating fallback...");
    // Fallback definition if not defined elsewhere
    window.saveEnhancedData = function (specificOfferName = null) {
      // Get session ID (try multiple sources)
      const sessionId = window.latestServerSessionId ||
        window.surveyResponses?.sessionId ||
        sessionStorage.getItem('session_id') ||
        (window.estimateData && window.estimateData.sessionId);

      if (!sessionId) {
        console.warn("Cannot save enhanced data: No Session ID found.");
        return;
      }

      // ENSURE DATA EXISTS: If offer terms are missing, try to recalculate
      if (!window.calculatedOfferTerms || Object.keys(window.calculatedOfferTerms).length === 0) {
        console.warn("⚠️ calculatedOfferTerms is empty! Attempting forced recalculation...");
        if (typeof window.updateOfferPrices === 'function' && window.currentDiscountOffers && window.processedServices) {
          // Try to find total cost
          let cost = window.surveyResponses?.totalServiceCost || 0;
          if (!cost) {
            const el = document.getElementById('totalServiceCost');
            if (el) cost = parseInt(el.textContent.replace(/[^\d]/g, '')) || 0;
          }

          // Force run
          try {
            window.updateOfferPrices(cost, window.currentDiscountOffers, window.processedServices);
            // console.log("✅ Forced recalculation done. New terms:", window.calculatedOfferTerms);
          } catch (e) { console.error("Recalculation failed", e); }
        }
      }

      const payload = {
        partial_update: true,
        session_id: sessionId,
        offers_breakdown: window.calculatedOfferTerms,
        comparison_json: window.estimateData?.costBreakdown?.category_comparisons,
        selected_offer: specificOfferName || window.surveyResponses?.selectedOffer // Include selected offer
      };

      // console.log("Sending Enhanced Data Partial Update:", payload);

      fetch('assets/api/saveAllSurveyData.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(r => r.json())
        .then(d => {
          // console.log("Enhanced Data Saved (Partial):", d);
          if (d.success && typeof showToast === 'function') {
            // specificOfferName is passed when clicking "Select This Offer"
            if (specificOfferName) showToast("Offer Selection Saved!");
          }
        })
        .catch(e => console.error("Enhanced Data Save Failed:", e));
    };
    window.saveEnhancedData();
  }

  // Update offer items on the page
  const offerItems = document.querySelectorAll(".offer-item");
  offerItems.forEach(item => {
    const offerNameRaw = item.querySelector(".offer-name").textContent.trim();
    // Try exact, then lowercase
    const normRaw = normalizeOfferName(offerNameRaw);
    let offerData = offerLookup[normRaw];

    // Fallback default
    if (!offerData) {
      offerData = { price: totalServiceCost, term: "(Full Payment)" };
    }

    const priceElement = item.querySelector(".offer-price");
    if (priceElement) {
      priceElement.textContent = `${offerData.term}`;
    }

    // Update Mobile Dropdown text with discount info
    const planValue = item.getAttribute('data-plan');
    const mobileSelect = document.getElementById('mobileOfferSelect');
    if (mobileSelect && planValue) {
      const option = mobileSelect.querySelector(`option[value="${planValue}"]`);
      if (option) {
        // Use just the term e.g. "(20% OFF)" or empty if full payment/undefined
        // Avoid cluttering if term is simple
        let term = offerData.term || "";
        // Optionally hide (Full Payment) text to keep it clean, or keep it. User asked for %, so Full Payment implies 0%
        option.textContent = `${offerNameRaw} ${term}`;
      }
    }

    // Also update subtitle if exists
    const subtitleElement = item.querySelector(".offer-subtitle");
    if (subtitleElement) {
      // Some logic to update subtitle price if needed, or leave as is
      // Original code might have had this?
      // Looking at previous `view_file` (Step 3453), the loop was simple.
      // priceElement.textContent = `${offerData.term}`;
    }
  });

  // Duplicate removed - selectCurrentOffer now defined at top of file

  document.addEventListener('click', function (e) {
    // Fallback listener for buttons without onclick
    const btn = e.target.closest('#choosePlanBtn') || e.target.closest('#choosePlanBtnDesktop');
    if (btn) {
      window.selectCurrentOffer(btn);
    }
  });

  // Prevent double click layout shifts on offer cards
  document.addEventListener('dblclick', function (e) {
    if (e.target.closest('.offer-item') || e.target.closest('.alacrity-service-card') || e.target.closest('.offers-card')) {
      e.preventDefault();
    }
  });


  // Update offer details for the currently displayed offer (if any)
  const detailsPlanName = document.getElementById('detailsPlanName');
  if (detailsPlanName && detailsPlanName.textContent.trim()) {
    const currentPlanName = detailsPlanName.textContent.trim();
    updateOfferDetailsDisplay(currentPlanName);
  }



  // Update service display and costs considering offer inclusions
  updateServiceDisplayAndCosts();

  // Update total amount to pay after offer prices are updated
  updateTotalAmountToPay();
}


// Expose to window for inline onclick
window.updateOfferServicesDisplay = updateOfferServicesDisplay;



// Function to update offer services display in the cost summary
function updateOfferServicesDisplay(offerName, allServices) {
  const summaryOfferServices = document.getElementById('summaryOfferServices');
  const offerServicesAccordionContent = document.getElementById('offerServicesAccordionContent');

  // console.log(`updateOfferServicesDisplay called for: "${offerName}"`);

  if (!summaryOfferServices || !offerServicesAccordionContent) {
    console.warn('Offer services elements not found');
    return;
  }

  // Get the features included in this offer
  let offerFeatures = [];
  const allOffers = window.currentDiscountOffers || [];
  const offerObj = allOffers.find(o => o.offer_name === offerName);

  if (offerObj) {
    // console.log('Found offer object:', offerObj);
    if (offerObj.details && offerObj.details.features) {
      offerFeatures = offerObj.details.features;
      // console.log('Offer features:', offerFeatures);
    }
  } else {
    console.warn('Offer object NOT found in window.currentDiscountOffers', allOffers);
  }

  if (offerFeatures.length === 0) {
    console.log('No features found for this offer.');
    summaryOfferServices.textContent = 'Not Selected';
    offerServicesAccordionContent.innerHTML = '<ol class="services-list" id="offerServicesOrderedList"></ol>';
    const offerServicesOrderedList = document.getElementById('offerServicesOrderedList');
    const li = document.createElement('li');
    li.textContent = 'No services included in this offer';
    offerServicesOrderedList.appendChild(li);
    return;
  }

  // Find services that are included in this offer
  // Normalize strings for better matching
  const includedServices = processedServices.filter(service =>
    offerFeatures.some(feature => {
      const sName = (service.name || '').toLowerCase();
      const fName = feature.toLowerCase();
      const match = sName.includes(fName);
      // console.log(`Checking service "${sName}" vs feature "${fName}" => ${match}`);
      return match;
    })
  );

  // console.log(`Matched ${includedServices.length} services included in offer:`, includedServices);

  // Update the summary text
  if (includedServices.length > 0) {
    summaryOfferServices.textContent = `${includedServices.length} Service${includedServices.length === 1 ? '' : 's'}`;
  } else {
    summaryOfferServices.textContent = 'Not Selected';
  }

  // Build the accordion content - simple ordered list like Required Services
  offerServicesAccordionContent.innerHTML = '<ol class="services-list" id="offerServicesOrderedList"></ol>';
  const offerServicesOrderedList = document.getElementById('offerServicesOrderedList');

  if (includedServices.length > 0) {
    includedServices.forEach(service => {
      const li = document.createElement('li');
      const capitalizedName = service.name.charAt(0).toUpperCase() + service.name.slice(1).toLowerCase();
      li.textContent = capitalizedName;
      offerServicesOrderedList.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'No services included in this offer';
    offerServicesOrderedList.appendChild(li);
  }
}


// Unified function to update offer details display (replaces both updateOfferDetailsDisplay and updateOfferDetailsSection)
function updateOfferDetailsDisplay(planName, offerDetail = null) {
  // Since we removed offerDetails object, we only use dynamic content now

  // Call the global helper immediately
  if (window.updateChooseBtnState) {
    window.updateChooseBtnState(planName);
  }

  // Get the current offer price from the offer item
  let offerPrice = 0;
  const offerItem = Array.from(document.querySelectorAll('.offer-item')).find(item =>
    item.querySelector('.offer-name').textContent.trim() === planName
  );

  if (offerItem) {
    const priceText = offerItem.querySelector('.offer-price').textContent.trim();
    const priceMatch = priceText.match(/₹([\d,]+)/);
    if (priceMatch) {
      offerPrice = parseInt(priceMatch[1].replace(/,/g, '')) || 0;
    }
  }

  // Update details section
  const detailsPlanName = document.getElementById('detailsPlanName');
  // const detailsPlanPrice = document.getElementById('detailsPlanPrice');
  const detailsFeaturesList = document.getElementById('detailsPlanFeatures');

  if (detailsPlanName) {
    detailsPlanName.textContent = planName;
  }


  if (detailsFeaturesList) {
    detailsFeaturesList.innerHTML = '';

    // --- Update Offer Icon ---
    const iconMap = {
      'Start Smart, Scale Fast': 'fa-rocket',
      'Design-First Confidence': 'fa-piggy-bank',
      'Premium Design Blueprint': 'fa-clock',
      'Execution-Ready Starter Pack': 'fa-eye',
      'Premium Execution Pack': 'fa-star',
      'Luxury Turnkey Transformation': 'fa-crown'
    };

    const iconClass = iconMap[planName] || 'fa-gift';

    // Update both modal and inline icons
    ['modalOfferIcon', 'detailsOfferIcon'].forEach(id => {
      const iconContainer = document.getElementById(id);
      if (iconContainer) {
        iconContainer.innerHTML = `<i class="fa ${iconClass}"></i>`;
      }
    });
    // -------------------------

    // Get offer-specific content based on plan name
    let offerContent = [];



    // Find the offer object from the global array (fetched from backend)
    const offerObj = window.currentDiscountOffers ? window.currentDiscountOffers.find(o => o.offer_name === planName) : null;
    const details = offerObj ? offerObj.details : null;

    if (details) {
      if (details.start_stage_1) {
        offerContent.push(`✅ ${details.start_stage_1.replace(/\s*\(.*?\)\s*/g, '')}`);
        if (Array.isArray(details.start_stage_1_details)) {
          offerContent.push(...details.start_stage_1_details.map(d => `• ${d}`));
        }
      }

      offerContent.push(""); // Spacer

      if (details.start_stage_2) {
        offerContent.push(`✅ ${details.start_stage_2.replace(/\s*\(.*?\)\s*/g, '')}`);
        if (Array.isArray(details.start_stage_2_details)) {
          offerContent.push(...details.start_stage_2_details.map(d => `• ${d}`));
        }
      }

      offerContent.push(""); // Spacer

      if (details.why_this_offer) {
        offerContent.push("💡 Why this offer?");
        if (Array.isArray(details.why_this_offer)) {
          offerContent.push(...details.why_this_offer);
        }
      }

      offerContent.push(""); // Spacer

      if (details.positioning) {
        offerContent.push(`Positioning: ${details.positioning}`);
      }
      if (details.cta) {
        offerContent.push(`CTA: ${details.cta}`);
      }
    } else {
      // Fallback for offers not found in backend response (should not happen if synced)
      offerContent = [
        `✅ Details for ${planName}`,
        '• Comprehensive Design Services',
        '• Project Management',
        '• Quality Assurance'
      ];
    }

    offerContent.forEach(feature => {
      const li = document.createElement('li');

      // Check if this is a stage header (contains "Stage")
      if (feature.includes('Stage') && feature.includes(':')) {
        li.style.fontWeight = 'bold';
        li.style.color = '#383838';
        li.style.fontSize = '1.1em';
        li.style.marginTop = '15px';
        li.style.marginBottom = '8px';
        li.textContent = feature;
      }
      // Check if this is a "Why this offer?" header
      else if (feature.includes('Why this offer?')) {
        li.style.fontWeight = 'bold';
        li.style.color = '#383838';
        li.style.fontSize = '1.1em';
        li.style.marginTop = '15px';
        li.style.marginBottom = '8px';
        li.textContent = feature;
      }
      // Check for Positioning
      else if (feature.startsWith('Positioning: ')) {
        li.style.fontWeight = 'bold';
        li.style.fontStyle = 'italic';
        li.style.color = '#383838'; // Or a specific color if needed
        li.style.marginTop = '10px';
        li.textContent = feature.replace('Positioning: ', '');
      }
      // Check for CTA
      else if (feature.startsWith('CTA: ')) {
        li.style.fontWeight = 'bold';
        li.style.fontStyle = 'italic';
        li.style.color = '#e50215'; // CTA color, maybe red?
        li.style.marginTop = '5px';
        li.textContent = feature.replace('CTA: ', '');
      }
      // Check if this is an empty line (for spacing)
      else if (feature === '' || feature === null || feature === undefined) {
        li.style.height = '8px';
        li.style.listStyle = 'none';
        li.innerHTML = '';
      }
      // Regular text
      else {
        li.textContent = feature;
      }

      detailsFeaturesList.appendChild(li);
    });
  } else {
    // For offers <= 25k, show complete price in Stage 1 only
    const standardFeatures = [
      `Stage 1: Pay ₹${offerPrice.toLocaleString()} upfront → Complete Project`,
      'Site Visit + Consultation',
      'Complete Design & Planning',
      'Final Delivery & Handover',
      ,
      'Why choose this offer?',
      'Simple one-time payment for smaller projects',
      'No complex payment structure',
      'Perfect for budget-conscious clients'
    ];

    standardFeatures.forEach(feature => {
      const li = document.createElement('li');

      // Check if this is a stage header (contains "Stage")
      if (feature.includes('Stage') && feature.includes(':')) {
        li.style.fontWeight = 'bold';
        li.style.color = '#383838';
        li.style.fontSize = '1.1em';
        li.style.marginTop = '15px';
        li.style.marginBottom = '8px';
        li.textContent = feature;
      }
      // Check if this is a "Why choose this offer?" header
      else if (feature.includes('Why choose this offer?')) {
        li.style.fontWeight = 'bold';
        li.style.color = '#383838';
        li.style.fontSize = '1.1em';
        li.style.marginTop = '15px';
        li.style.marginBottom = '8px';
        li.textContent = feature;
      }
      // Check if this is an empty line (for spacing)
      else if (feature === '' || feature === null || feature === undefined) {
        li.style.height = '8px';
        li.style.listStyle = 'none';
        li.innerHTML = '';
      }
      // Regular text
      else {
        li.textContent = feature;
      }

      detailsFeaturesList.appendChild(li);
    });
  }
}





// Show offer modal with correct pricing
function showOfferModal(planName) {
  const offerModal = document.getElementById('offerModal');
  if (!offerModal) return;

  // Get current service cost
  let totalServiceCost = window.surveyResponses?.totalServiceCost || 0;
  if (totalServiceCost === 0) {
    const totalServiceCostElement = document.getElementById('totalServiceCost');
    if (totalServiceCostElement) {
      const costText = totalServiceCostElement.textContent.replace(/[₹,]/g, '');
      totalServiceCost = parseInt(costText) || 0;
      console.log(totalServiceCost);
    }
  }

  // Update modal content
  const modalPlanName = document.getElementById('modalPlanName');
  const modalDetailsPlanName = document.getElementById('modalDetailsPlanName');
  const modalPlanFeatures = document.getElementById('modalPlanFeatures');

  if (modalPlanName) {
    modalPlanName.textContent = planName;
  }

  if (modalDetailsPlanName) {
    modalDetailsPlanName.textContent = planName;
  }

  // modalPlanPrice element has been removed

  if (modalPlanFeatures) {
    modalPlanFeatures.innerHTML = '';

    // Use the same dynamic content logic as the main display
    updateOfferDetailsDisplay(planName);
  }

  // Show modal
  offerModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Offer Modal and Details Handler
function handleOfferItemClick(offerItem) {


  // Get plan name from data attribute or offer name element
  const planType = offerItem.getAttribute('data-plan');
  const offerNameElement = offerItem.querySelector('.offer-name');
  const planName = offerNameElement ? offerNameElement.textContent.trim() : '';

  // Find offer details
  const offerDetail = offerDetails[planName];


  // Check screen size to determine behavior
  if (window.innerWidth < 768) {
    // Mobile: Show modal
    showOfferModal(planName);
  } else {
    // Desktop: Update details section
    updateOfferDetailsSection(offerDetail);
  }
}

// Show offer modal (mobile)
// function showOfferModal(offerDetail) REMOVED - duplicate legacy code

// Update details section (desktop) - now uses unified updateOfferDetailsDisplay function
function updateOfferDetailsSection(offerDetail) {
  updateOfferDetailsDisplay(offerDetail.name, offerDetail);
}

// Close offer modal
function closeOfferModal() {
  const offerModal = document.getElementById('offerModal');
  if (offerModal) {
    offerModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function toggleAccordion(accordionId) {
  const accordionItem = document.getElementById(accordionId + 'Item');
  const accordionArrow = document.getElementById(accordionId + 'Arrow');

  const isActive = accordionItem && accordionItem.classList.contains('active');

  // Close all accordions first
  document.querySelectorAll('.accordion-item').forEach(item => {
    item.classList.remove('active');
    const arrow = item.querySelector('.accordion-arrow');
    if (arrow) arrow.style.transform = '';
  });

  // If the clicked accordion was not open, open it
  if (accordionItem && !isActive) {
    accordionItem.classList.add('active');
    if (accordionArrow) accordionArrow.style.transform = 'rotate(180deg)';
  }
  // If the clicked accordion was open, leave it closed (toggle off)
}






















function selectCompanyType(type, element) {
  // Remove selected class from all cards
  document.querySelectorAll('.payment-company-card').forEach(card => {
    card.classList.remove('selected');
  });

  // Add selected class to clicked card
  element.classList.add('selected');

  // Update radio button
  document.getElementById('payment' + (type === 'individual' ? 'Individual' : 'Business')).checked = true;

  // Show/hide business fields
  const businessFields = document.getElementById('paymentBusinessFields');
  if (type === 'business') {
    businessFields.style.display = 'flex';
  } else {
    businessFields.style.display = 'none';
  }
}

function selectPaymentMethod(method, element) {
  // Remove selected class from all options
  document.querySelectorAll('.payment-method-option').forEach(option => {
    option.classList.remove('selected');
  });

  // Add selected class to clicked option
  element.classList.add('selected');

  // Update radio button
  element.querySelector('input[type="radio"]').checked = true;
}

function toggleCouponInput(event) {
  event.preventDefault();
  const couponInput = document.getElementById('paymentCouponInput');
  const couponLink = event.target;

  if (couponInput.style.display === 'none') {
    couponInput.style.display = 'block';
    couponLink.textContent = 'Hide coupon';
  } else {
    couponInput.style.display = 'none';
    couponLink.textContent = 'Have a coupon?';
  }
}

function toggleCompleteButton() {
  const termsCheckbox = document.getElementById('paymentTerms');
  const completeButton = document.getElementById('paymentCompleteBtn');

  completeButton.disabled = !termsCheckbox.checked;
}



// Auto-update dependent fields based on selections
document.addEventListener('change', function (event) {
  if (event.target.name === 'payment_hear_about') {
    const detailField = document.querySelector('input[name="payment_hear_about_detail"]');
    if (event.target.value === 'others') {
      detailField.required = true;
      detailField.placeholder = 'Please specify';
    } else {
      detailField.required = false;
      detailField.placeholder = 'Please specify (Optional)';
    }
  }
});

// // Fix style-navigator sticky positioning for screens between 320px and 425px
// function fixStyleNavigatorSticky() {
//     const styleNavigator = document.querySelector('.style-navigator');
//     if (!styleNavigator) return;

//     const screenWidth = window.innerWidth;
//     const isTargetScreen = screenWidth >= 320 && screenWidth <= 425;

//     if (isTargetScreen) {
//         // Remove any existing inline styles
//         styleNavigator.style.position = 'sticky';
//         styleNavigator.style.top = '6rem';
//         styleNavigator.style.zIndex = '100';
//     } else {
//         // Reset to default for other screen sizes
//         styleNavigator.style.position = '';
//         styleNavigator.style.top = '';
//         styleNavigator.style.zIndex = '';
//     }
// }



// Social sharing functions
function shareOnFacebook() {
  const message = generateShareMessage();
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(message);

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
  window.open(facebookUrl, '_blank', 'width=600,height=400');
}

function shareOnTwitter() {
  const message = generateShareMessage();
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(message);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  window.open(twitterUrl, '_blank', 'width=600,height=400');
}

function shareOnGmail() {
  const message = generateShareMessage();
  const subject = encodeURIComponent('My Interior Design Estimate from Alacritys');
  const body = encodeURIComponent(message);

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${subject}&body=${body}`;
  window.open(gmailUrl, '_blank', 'width=800,height=600');
}

function shareOnLinkedIn() {
  const message = generateShareMessage();
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(message);

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${encodeURIComponent('Interior Design Estimate')}&summary=${text}`;
  window.open(linkedinUrl, '_blank', 'width=600,height=400');
}

// Function to generate share message with cost estimate
function generateShareMessage() {
  const estimateData = window.estimateData;
  const surveyData = window.surveyResponses;

  if (!estimateData || !estimateData.costBreakdown) {
    return "Check out this amazing interior design cost calculator! Get your project estimate in minutes.";
  }

  const totalCost = estimateData.costBreakdown.final_project_cost;
  const currency = estimateData.currency || '₹';
  const projectType = estimateData.clientDetails?.projectType || 'Home Interior';
  const city = surveyData?.city || 'your city';
  const area = estimateData.costBreakdown.areaCalculations?.total_room_area || 0;

  return `🏠 Just got my ${projectType} estimate from Alacritys!

📊 Project Details:
• Total Cost: ${currency}${totalCost.toLocaleString()}
• Carpet Area: ${area} sqft
• Location: ${city}

✨ Get your free estimate in minutes: ${window.location.href}

#InteriorDesign #HomeRenovation #Alacritys`;
}

// Function to share on Facebook
function shareOnFacebook() {
  const message = generateShareMessage();
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(message);

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
  window.open(facebookUrl, '_blank', 'width=600,height=400');
}

// Function to share on Twitter/X
function shareOnTwitter() {
  const message = generateShareMessage();
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(message);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  window.open(twitterUrl, '_blank', 'width=600,height=400');
}

// Function to share on Instagram
function shareOnInstagram() {
  const message = generateShareMessage();

  // Create a more Instagram-friendly message
  const instagramMessage = `🏠 Interior Design Estimate from Alacritys!

📊 My Project Details:
• Total Cost: ${window.estimateData?.costBreakdown?.final_project_cost?.toLocaleString() || 'Check estimate'} ₹
• Area: ${window.estimateData?.costBreakdown?.areaCalculations?.total_room_area || 'Custom'} sqft
• Location: ${window.surveyResponses?.city || 'Your City'}

✨ Get your FREE estimate in minutes!
Link in bio 👆

#InteriorDesign #HomeRenovation #Alacritys #DesignInspiration #HomeMakeover #InteriorGoals`;

  // Copy to clipboard
  navigator.clipboard.writeText(instagramMessage).then(() => {
    // Show a better modal with options
    const shareOptions = `
📱 Instagram Sharing Options:

Option 1 - Story/Post:
1. Open Instagram app
2. Create a new story or post
3. Paste the copied message
4. Add your estimate screenshot
5. Share with your followers!

Option 2 - Instagram Bio:
1. Copy the website link: ${window.location.href}
2. Add to your Instagram bio
3. Update your bio with: "Get your FREE interior design estimate! Link in bio 👆"

Option 3 - Instagram Reels:
1. Take a screenshot of your estimate
2. Create a reel showing the estimate
3. Use the copied message as caption
4. Add relevant hashtags

💡 Pro Tips:
• Screenshots work better than text
• Use Instagram stories for quick sharing
• Add before/after inspiration photos
• Tag @alacritys for better reach

Would you like to copy the website link separately?`;

    if (confirm(shareOptions)) {
      // Copy website link separately
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Website link copied! Add it to your Instagram bio.');
      });
    }

    showToast('Instagram message copied! Open Instagram to share.');
  }).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = instagramMessage;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    showToast('Instagram message copied! Open Instagram to share.');

    const shareOptions = `
📱 Instagram Sharing Options:

Option 1 - Story/Post:
1. Open Instagram app
2. Create a new story or post
3. Paste the copied message
4. Add your estimate screenshot
5. Share with your followers!

Option 2 - Instagram Bio:
1. Copy the website link: ${window.location.href}
2. Add to your Instagram bio
3. Update your bio with: "Get your FREE interior design estimate! Link in bio 👆"

Option 3 - Instagram Reels:
1. Take a screenshot of your estimate
2. Create a reel showing the estimate
3. Use the copied message as caption
4. Add relevant hashtags

💡 Pro Tips:
• Screenshots work better than text
• Use Instagram stories for quick sharing
• Add before/after inspiration photos
• Tag @alacritys for better reach`;

    alert(shareOptions);
  });
}

// Function to share via Gmail
function shareOnGmail() {
  const message = generateShareMessage();
  const subject = encodeURIComponent('My Interior Design Estimate from Alacritys');
  const body = encodeURIComponent(message);

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${subject}&body=${body}`;
  window.open(gmailUrl, '_blank', 'width=800,height=600');
}

// Function to share on LinkedIn
function shareOnLinkedIn() {
  const message = generateShareMessage();
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(message);

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${encodeURIComponent('Interior Design Estimate')}&summary=${text}`;
  window.open(linkedinUrl, '_blank', 'width=600,height=400');
}



// Function to handle shared estimate links
function handleSharedEstimate() {
  const urlParams = new URLSearchParams(window.location.search);
  const estimateParam = urlParams.get('estimate');

  if (estimateParam) {
    try {
      const sharedData = JSON.parse(decodeURIComponent(estimateParam));

      // Show a welcome message for shared estimate
      if (sharedData.total && sharedData.projectType) {
        const welcomeMessage = `
      🏠 Welcome! You're viewing a shared estimate:

      📊 Project Details:
      • Project Type: ${sharedData.projectType}
      • Total Cost: ₹${sharedData.total.toLocaleString()}
      • Carpet Area: ${sharedData.area} sqft
      • Location: ${sharedData.city || 'Not specified'}
      • Design Style: ${sharedData.style || 'Not specified'}
      • Category: ${sharedData.category}

      ✨ Want your own estimate? Start the survey to get your personalized quote!
        `;

        // Show the message after a short delay
        setTimeout(() => {
          showToast('Shared estimate loaded! Start your own survey to get your estimate.');
        }, 1000);

        // Store shared data for reference
        window.sharedEstimateData = sharedData;
      }
    } catch (error) {
      console.error('Error parsing shared estimate:', error);
    }
  }
}

// Call this function when page loads
document.addEventListener('DOMContentLoaded', function () {
  handleSharedEstimate();
});

// Function to handle Contact Us button click
function contactUs() {
  const estimateData = window.estimateData;
  const surveyData = window.surveyResponses;

  if (!estimateData || !surveyData) {
    showToast('Please complete the survey first to get your estimate.');
    return;
  }

  // Prepare WhatsApp message with estimate details
  const whatsappMessage = `🏠 *Interior Design Quote Request*

💰 *My Current Estimate:* ₹${estimateData.costBreakdown?.final_project_cost?.toLocaleString() || 0}

📊 *Project Details:*
• Project Type: ${estimateData.clientDetails?.projectType || 'Home Interior'}
• Total Carpet Area: ${estimateData.costBreakdown?.areaCalculations?.total_room_area || 0} sqft
• Location: ${surveyData.city || 'Not specified'}
• Design Style: ${estimateData.designPreferences?.selectedStyle || 'Not specified'}

🏗️ *Selected Rooms:*
${Object.entries(surveyData.selectedRooms || {}).map(([room, count]) => `• ${room}: ${count}`).join('\n')}

🎨 *Selected Services:*
${surveyData.selectedServices?.map(service => {
    const serviceData = window.currentServices?.find(s => s.service_id == service.service_id);
    return `• ${serviceData?.name || service}: ₹${serviceData?.price || 0}`;
  }).join('\n') || 'No services selected'}

📞 *My Contact Info:*
• Name: ${surveyData.firstName && surveyData.lastName ? `${surveyData.firstName} ${surveyData.lastName}` : (surveyData.name || 'Not provided')}
• Email: ${surveyData.email || 'Not provided'}
• Phone: ${surveyData.phone || 'Not provided'}

💬 *Message:*
I'm interested in getting a personalized quote with custom materials, finishes, and additional offers. Please contact me to discuss more options and better deals for my project.

✨ *Get your own estimate:* ${window.location.href}`.trim();

  // Encode message for WhatsApp URL
  const encodedMessage = encodeURIComponent(whatsappMessage);
  const whatsappNumber = '917387383128'; // Alacritys WhatsApp number
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  // Open WhatsApp in new tab
  window.open(whatsappUrl, '_blank');

  // Show success message
  showToast('Opening WhatsApp with your project details!');
}

// Function to toggle coupon input
function toggleCouponInput(event) {
  event.preventDefault();
  const couponInput = document.getElementById('couponInput');
  const couponLink = event.target;

  if (couponInput.style.display === 'none') {
    couponInput.style.display = 'block';
    couponLink.textContent = 'Hide coupon';
  } else {
    couponInput.style.display = 'none';
    couponLink.textContent = 'Have a coupon?';
  }
}

// Function to select payment method
function selectPaymentMethod(method, element) {
  // Remove selected class from all options
  document.querySelectorAll('.payment-method-option').forEach(option => {
    option.classList.remove('selected');
  });

  // Add selected class to clicked option
  element.classList.add('selected');

  // Update radio button
  element.querySelector('input[type="radio"]').checked = true;
}

// Function to toggle complete button based on terms checkbox
function toggleCompleteButton() {
  const termsCheckbox = document.getElementById('termsCheckbox');
  const completeButton = document.getElementById('completePurchaseBtn');

  if (termsCheckbox && completeButton) {
    completeButton.disabled = !termsCheckbox.checked;
  }
}

prefillAccountDetails();

// Function to handle complete purchase button click
function handleCompletePurchase() {
  const termsCheckbox = document.getElementById('termsCheckbox');
  const completeButton = document.getElementById('completePurchaseBtn');

  // Pre-fill account details from survey responses


  // Check if terms are accepted
  if (!termsCheckbox || !termsCheckbox.checked) {
    alert('Please accept the Terms & Conditions to proceed.');
    return;
  }

  // Get payment method
  const selectedPaymentMethod = document.querySelector('input[name="payment_method"]:checked');
  if (!selectedPaymentMethod) {
    alert('Please select a payment method.');
    return;
  }

  // Get form data
  const formData = {
    // Account Details
    name: document.getElementById('payment_name')?.value || '',
    website: document.getElementById('payment_website')?.value || '',
    email: document.getElementById('payment_email')?.value || '',
    countryCode: document.getElementById('payment_country_code')?.value || '',
    phone: document.getElementById('payment_phone')?.value || '',

    // Billing Details
    billingCountry: document.getElementById('payment_billing_country')?.value || '',
    billingAddress: document.getElementById('payment_billing_address')?.value || '',
    billingPincode: document.getElementById('payment_billing_pincode')?.value || '',
    billingCity: document.getElementById('payment_billing_city')?.value || '',
    billingState: document.getElementById('payment_billing_state')?.value || '',

    // Company Details
    companyType: document.querySelector('input[name="payment_company_type"]:checked')?.value || 'individual',
    businessName: document.getElementById('payment_business_name')?.value || '',
    gstNumber: document.getElementById('payment_gst_number')?.value || '',

    // Payment Details
    paymentMethod: selectedPaymentMethod.value,
    couponCode: document.getElementById('couponCode')?.value || '',

    // Estimate Data
    totalCost: document.getElementById('totalServiceCost')?.textContent || '₹0',
    chosenOffer: document.getElementById('chosenOffer')?.textContent || '',
    projectType: document.getElementById('summaryProjectType')?.textContent || '',
    carpetArea: document.getElementById('summaryCarpetArea')?.textContent || '',
    style: document.getElementById('summaryStyle')?.textContent || '',
    designCategory: document.getElementById('summaryDesignCategory')?.textContent || ''
  };

  // Validate required fields
  const requiredFields = ['name', 'email', 'phone'];
  const missingFields = requiredFields.filter(field => !formData[field]);

  if (missingFields.length > 0) {
    alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
    return;
  }

  // Show loading state
  completeButton.disabled = true;
  completeButton.textContent = 'Processing...';

  // Simulate payment processing (replace with actual payment gateway integration)
  setTimeout(() => {
    // Here you would typically:
    // 1. Send data to your payment gateway (RazorPay, Stripe, etc.)
    // 2. Handle payment response
    // 3. Send confirmation email
    // 4. Redirect to success page

    // For now, show success message
    alert('Payment processed successfully! You will receive a confirmation email shortly.');

    // Reset button
    completeButton.disabled = false;
    completeButton.textContent = 'Complete Purchase';

    // Optionally redirect to thank you page
    // window.location.href = 'thankyou.html';

  }, 2000);
}

// Function to pre-fill account details from survey responses
function prefillAccountDetails() {
  if (window.surveyResponses) {
    const responses = window.surveyResponses;

    // Pre-fill account details (readonly)
    const nameField = document.getElementById('payment_name');
    if (nameField && responses.firstName && responses.lastName) {
      nameField.value = responses.firstName + ' ' + responses.lastName;
    } else if (nameField && responses.name) {
      // Fallback to old name field if firstName/lastName not available
      nameField.value = responses.name;
    }

    const websiteField = document.getElementById('payment_website');
    if (websiteField) {
      websiteField.value = responses.website || 'https://';
    }

    const emailField = document.getElementById('payment_email');
    if (emailField && responses.email) {
      emailField.value = responses.email;
    }

    const countryCodeField = document.getElementById('payment_country_code');
    if (countryCodeField && responses.countryCode) {
      // Map country codes to select field values
      let countryValue = 'IN'; // Default to India
      switch (responses.countryCode) {
        case '+91':
          countryValue = 'IN';
          break;
        case '+1':
          countryValue = 'US';
          break;
        case '+44':
          countryValue = 'GB';
          break;
        case '+61':
          countryValue = 'AU';
          break;
        default:
          countryValue = 'IN';
      }
      countryCodeField.value = countryValue;
    }

    const phoneField = document.getElementById('payment_phone');
    if (phoneField && responses.phone) {
      phoneField.value = responses.phone;
    }

    // Pre-fill billing details
    const billingCountryField = document.getElementById('payment_billing_country');
    if (billingCountryField && responses.country) {
      billingCountryField.value = responses.country || 'India';
    }

    const billingPincodeField = document.getElementById('payment_billing_pincode');
    if (billingPincodeField && responses.pincode) {
      billingPincodeField.value = responses.pincode;
    }

    const billingCityField = document.getElementById('payment_billing_city');
    if (billingCityField && responses.city) {
      billingCityField.value = responses.city;
    }

    const billingStateField = document.getElementById('payment_billing_state');
    if (billingStateField && responses.state) {
      billingStateField.value = responses.state;
    }

    // Pre-fill company details if available
    const businessNameField = document.getElementById('payment_business_name');
    if (businessNameField && responses.company) {
      businessNameField.value = responses.company;
    }

    const gstField = document.getElementById('payment_gst_number');
    if (gstField && responses.gst) {
      gstField.value = responses.gst;
    }

    // Set company type based on whether company name is provided
    if (responses.company) {
      const businessRadio = document.getElementById('paymentBusiness');
      const individualRadio = document.getElementById('paymentIndividual');
      if (businessRadio && individualRadio) {
        businessRadio.checked = true;
        individualRadio.checked = false;
        // Show business fields
        const businessFields = document.getElementById('paymentBusinessFields');
        if (businessFields) {
          businessFields.style.display = 'flex';
        }
      }
    }
  }
}

// Logo click detection and back navigation detection
document.addEventListener('DOMContentLoaded', function () {
  // Logo click detection
  const logoElement = document.querySelector('.logo');
  if (logoElement) {
    logoElement.addEventListener('click', function (e) {
      e.preventDefault(); // Prevent the default link behavior
      console.log('back operation call - logo clicked');
      showExitModal();
    });
  }

  // Prevent back button on page load
  history.pushState(null, null, window.location.href);

  // Back navigation detection
  window.addEventListener('popstate', function (e) {
    // console.log('back operation call - user tried to go back');
    showExitModal();
    // Prevent the back navigation and preserve scroll position
    const currentScrollY = window.scrollY;
    history.pushState(null, null, window.location.href);
    // Restore scroll position
    window.scrollTo(0, currentScrollY);
  });

  // Also detect browser back button
  window.addEventListener('beforeunload', function (e) {
    // console.log('back operation call - page unload detected');
    // Don't show modal on beforeunload as it won't work properly
  });

  // Detect when user tries to leave the page
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      // console.log('back operation call - page visibility changed');
      // This will trigger when user switches tabs or tries to leave
    }
  });
});

// Exit Modal Function
function showExitModal() {
  // --- Scroll Fix ---
  // Prevent browser from auto resetting scroll
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Save scroll before leaving page
  window.addEventListener("beforeunload", function () {
    localStorage.setItem("scrollY", window.scrollY);
  });

  // Restore scroll when page is loaded (including back navigation)
  window.addEventListener("load", function () {
    const savedY = localStorage.getItem("scrollY");
    if (savedY !== null) {
      window.scrollTo(0, parseInt(savedY, 10));
    }
  });
  // --- End Scroll Fix ---

  // Check if modal already exists
  if (document.getElementById('exitModal')) {
    return;
  }

  // Create modal HTML
  const modalHTML = `
    <div id="exitModal" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      cursor: pointer;
      padding: 20px;
      box-sizing: border-box;
    ">
      <div style="
        background: white;
        padding: 40px 30px;
        border-radius: 15px;
        max-width: 350px;
        width: 100%;
        text-align: center;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        cursor: default;
        box-sizing: border-box;
      ">
        <h2 style="
          margin: 0 0 15px 0;
          color: #333;
          font-family: Arial, sans-serif;
          font-size: clamp(20px, 5vw, 24px);
          font-weight: bold;
          line-height: 1.3;
        ">You're On Your Way<br>to Something Big!</h2>

        <p style="
          margin: 0 0 30px 0;
          color: #666;
          font-size: clamp(14px, 4vw, 16px);
          line-height: 1.5;
        ">Complete your estimate to<br>unlock these rewards</p>

        <div style="
          display: flex;
          flex-direction: column;
          margin-bottom: 30px;
          text-align: left;
          gap: 10px;
      ">
        <div style="
          display: flex;
          align-items: center;
            gap: clamp(10px, 3vw, 15px);
            padding: 5px;
            border-radius: 10px;
        ">
          <div style="
              width: clamp(40px, 12vw, 50px);
              height: clamp(40px, 12vw, 50px);
              background: #87ceeb;
              border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
              font-size: clamp(18px, 5vw, 24px);
              flex-shrink: 0;
            ">📦</div>
            <div style="
              font-size: clamp(14px, 4vw, 16px);
              color: #333;
              font-weight: 500;
              text-align: left;
              white-space: nowrap;
            ">Free 3D Design Consultation</div>
        </div>

          <div style="
            display: flex;
            align-items: center;
            gap: clamp(10px, 3vw, 15px);
            padding: 5px;
            border-radius: 10px;
          ">
              <div style="
              width: clamp(40px, 12vw, 50px);
              height: clamp(40px, 12vw, 50px);
              background: #ffd700;
              border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
              font-size: clamp(18px, 5vw, 24px);
              flex-shrink: 0;
            ">🎁</div>
            <div style="
              font-size: clamp(14px, 4vw, 16px);
              color: #333;
              font-weight: 500;
              text-align: left;
              white-space: nowrap;
            ">Luxury Décor Goodies</div>
            </div>

              <div style="
                display: flex;
                align-items: center;
            gap: clamp(10px, 3vw, 15px);
            padding: 5px;
            border-radius: 10px;
          ">
              <div style="
              width: clamp(40px, 12vw, 50px);
              height: clamp(40px, 12vw, 50px);
              background: #ff6b6b;
              border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
              font-size: clamp(18px, 5vw, 24px);
              flex-shrink: 0;
            ">🍽️</div>
            <div style="
              font-size: clamp(14px, 4vw, 16px);
              color: #333;
              font-weight: 500;
              text-align: left;
              white-space: nowrap;
            ">Taj Dining Vouchers</div>
          </div>
        </div>

        <button id="checkNowBtn" style="
          background: #ff4444;
          color: white;
          border: none;
          padding: clamp(12px, 3vw, 15px) clamp(30px, 8vw, 40px);
          border-radius: 8px;
          font-size: clamp(16px, 4vw, 18px);
          font-weight: bold;
          cursor: pointer;
          width: 100%;
          transition: background-color 0.3s ease;
        " onmouseover="this.style.background='#ff3333'" onmouseout="this.style.background='#ff4444'">Continue Now</button>
      </div>
    </div>
  `;

  // Add modal to page
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Add event listeners
  document.getElementById('checkNowBtn').addEventListener('click', function () {
    document.getElementById('exitModal').remove();
    localStorage.removeItem('surveyResponses');
    window.location.href = 'https://alacritys.in/blog/small-kitchen-island-island-design-ideas-for-your-home/';
  });

  // Close modal when clicking outside
  document.getElementById('exitModal').addEventListener('click', function (e) {
    if (e.target.id === 'exitModal') {
      localStorage.removeItem('surveyResponses');
      window.location.href = 'https://alacritys.in/blog/small-kitchen-island-island-design-ideas-for-your-home/';
    }
  });

  // Check for saved state on load (for normal users)
  // For Admin mode, we use the global checkAdminMode defined at the top
}

// ==========================================
// NEW: Full Data Save Function (Restored)
// ==========================================
window.saveDataForPDFDownload = function () {
  // console.log("saveDataForPDFDownload TRIGGERED");

  // 1. Gather Data Sources
  const reqData = window.lastSurveyRequestData;
  const resData = window.estimateData;
  const sessionId = window.latestServerSessionId || (resData && resData.additionalInfo && resData.additionalInfo.sessionId);

  if (!reqData || !sessionId) {
    console.error("Cannot save PDF data: Missing request data or session ID", { reqData, sessionId });
    return;
  }

  // 2. Prepare Payload (Merge Request + Calculated Data)
  const payload = {
    ...reqData,
    session_id: sessionId,

    // Add Calculated Costs
    constructionCost: resData?.costBreakdown?.construction_cost || 0,
    finalProjectCost: resData?.costBreakdown?.final_project_cost || 0,
    serviceCost: window.surveyResponses?.totalServiceCost || 0,
    totalRoomArea: resData?.costBreakdown?.areaCalculations?.total_room_area || 0,

    // Add Comparison Data
    categoryComparisons: resData?.costBreakdown?.category_comparisons || [],
    comparison_json: resData?.costBreakdown?.category_comparisons || [],

    // Add Offers Data (Critical Fix for Admin Panel)
    offers_breakdown: window.calculatedOfferTerms || {},

    // Add Selected Offer (if any)
    selectedOffer: window.surveyResponses?.selectedOffer || document.getElementById('chosenOffer')?.textContent || null,

    // --- FIX: Ensure selectedServices is flat array of IDs ---
    selectedServices: (window.surveyResponses?.selectedServices || []).map(s => (typeof s === 'object' && s.service_id) ? s.service_id : s),
    // --------------------------------------------------------

    // Standardize Style field (Backend expects selectedStyles array or selectedDesignStyle string)
    selectedStyles: reqData.selectedStyles || (reqData.selectedDesignStyle ? [reqData.selectedDesignStyle] : [])
  };

  // Ensure 'selectedServices' is present
  if (!payload.selectedServices && window.currentServices) {
    // Optional: map currentServices to selectedServices string array if needed
  }

  // console.log("Saving Full Survey Data Payload:", payload);

  // 3. Send to Backend
  fetch('assets/api/saveAllSurveyData.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(r => r.json())
    .then(d => {
      // console.log("Full Data Save Result:", d);
      if (d.success) {
        // console.log("✅ Data successfully saved to DB (ID: " + sessionId + ")");
      } else {
        console.error("❌ Data save failed:", d.message);
      }
    })
    .catch(e => console.error("Data save error:", e));
};

// --- CRITICAL FORCE FIX: Ensure House Architecture Logic Works ---
document.addEventListener('DOMContentLoaded', function () {
  // console.log("Force Fix: Initializing House Architecture Logic");

  // 1. Force Click Handlers for Floor Selection
  const floorOptions = document.querySelectorAll('.floor-option');
  floorOptions.forEach(box => {
    box.onclick = function () {
      // console.log("Floor Clicked:", this.dataset.value);
      // Visual Update
      document.querySelectorAll('.floor-option').forEach(el => el.classList.remove('active'));
      this.classList.add('active');

      // Data Update
      if (!window.surveyResponses) window.surveyResponses = {};
      if (!window.surveyResponses.architectureDetails) window.surveyResponses.architectureDetails = {};

      window.surveyResponses.architectureDetails.floors = this.dataset.value;
      window.surveyResponses.selectedFloor = this.dataset.value; // Legacy compat

      // console.log("Architecture Details Updated (Floor):", window.surveyResponses.architectureDetails);

      // Trigger save
      if (typeof saveSurveyResponsesToLocalStorage === 'function') saveSurveyResponsesToLocalStorage();
    };
  });

  // 2. Force Click Handlers for Pre-Construction Selection
  const preconOptions = document.querySelectorAll('.precon-option');
  preconOptions.forEach(box => {
    box.onclick = function () {
      const value = this.dataset.value;
      // console.log("Precon Clicked:", value);

      // Visual Update & Data Init
      if (!window.surveyResponses) window.surveyResponses = {};
      if (!window.surveyResponses.architectureDetails) window.surveyResponses.architectureDetails = {};
      if (!window.surveyResponses.architectureDetails.preConstruction) window.surveyResponses.architectureDetails.preConstruction = [];

      if (this.classList.contains('active')) {
        this.classList.remove('active');
        window.surveyResponses.architectureDetails.preConstruction = window.surveyResponses.architectureDetails.preConstruction.filter(v => v !== value);
      } else {
        this.classList.add('active');
        if (!window.surveyResponses.architectureDetails.preConstruction.includes(value)) {
          window.surveyResponses.architectureDetails.preConstruction.push(value);
        }
      }

      // console.log("Architecture Details Updated (PreCon):", window.surveyResponses.architectureDetails);

      // Trigger save
      if (typeof saveSurveyResponsesToLocalStorage === 'function') saveSurveyResponsesToLocalStorage();
    };
  });

  // 3. Force Visibility Check Loop (Ensures section appears even if original toggle fails)
  setInterval(() => {
    const section = document.getElementById("house_architecture_section");
    const fdiv = document.getElementById("fdiv");
    const pdiv = document.getElementById("pdiv");

    if (window.surveyResponses && window.surveyResponses.projectType && window.surveyResponses.projectType.trim().includes("House Architecture")) {
      // FIX: Do NOT show if form is already submitted (Result Page)
      if (window.isContactFormSubmitted) {
        if (section) section.style.display = 'none';
        return;
      }

      if (section && (section.style.display === 'none' || section.style.display === '')) {
        console.log("Force Fix: Showing House Architecture Section");
        section.style.display = 'block';
        if (fdiv) fdiv.style.display = 'flex';
        if (pdiv) pdiv.style.display = 'flex';
      }
    }
  }, 1000);
});

// Mobile Offer Dropdown Sync Logic
// Mobile Offer Dropdown Sync Logic
document.getElementById('mobileOfferSelect')?.addEventListener('change', function () {
  const selectedPlan = this.value;
  const offerItem = document.querySelector(`.offer-item[data-plan='${selectedPlan}']`);
  if (offerItem) {
    offerItem.click();
  }
});

// Sync Dropdown with Clicked Offer (Two-way binding)
document.addEventListener('click', function (e) {
  const offerItem = e.target.closest('.offer-item');
  if (offerItem) {
    const plan = offerItem.getAttribute('data-plan');
    const dropdown = document.getElementById('mobileOfferSelect');
    if (dropdown && dropdown.value !== plan) {
      dropdown.value = plan;
    }
  }
});

// Global Helper for Button State
window.updateChooseBtnState = function (currentDisplayedPlan) {
  // Target BOTH buttons: modal and desktop
  const buttons = [
    document.getElementById('choosePlanBtn'),
    document.getElementById('choosePlanBtnDesktop')
  ].filter(Boolean); // Remove nulls

  if (buttons.length === 0) return;

  // Check window.surveyResponses first, then localStorage as backup
  let selected = window.surveyResponses?.selectedOffer;

  if (!selected) {
    selected = localStorage.getItem('selected_offer_backup');
  }

  // Fallback to chosenOfferName (Legacy Global Variable)
  if (!selected && typeof chosenOfferName !== 'undefined' && chosenOfferName) {
    selected = chosenOfferName;
  }

  // Optimize: Sync back to memory if found in storage/global
  if (selected && window.surveyResponses && !window.surveyResponses.selectedOffer) {
    window.surveyResponses.selectedOffer = selected;
  }

  const normDisplayed = currentDisplayedPlan ? currentDisplayedPlan.trim().toLowerCase() : '';
  const normSelected = selected ? selected.trim().toLowerCase() : '';
  const isMatch = normDisplayed && normSelected &&
    (normDisplayed === normSelected ||
      normDisplayed.includes(normSelected) ||
      normSelected.includes(normDisplayed));

  // Apply state to ALL buttons
  buttons.forEach(choosePlanBtn => {
    if (isMatch) {
      choosePlanBtn.textContent = 'Selected';
      choosePlanBtn.classList.add('selected');
      choosePlanBtn.disabled = true;
      choosePlanBtn.classList.remove('btn-choose-plan-default');
    } else {
      choosePlanBtn.textContent = 'Select This Offer';
      choosePlanBtn.classList.remove('selected', 'btn-success');
      choosePlanBtn.disabled = false;
    }
  });
};

// Toggle Offer Details Accordion (Mobile)
window.toggleOfferDetails = function () {
  const section = document.getElementById('offerDetailsSection');
  const toggle = document.getElementById('offerDetailsToggle');
  if (!section || !toggle) return;

  if (section.classList.contains('expanded')) {
    section.classList.remove('expanded');
    toggle.classList.remove('active');
    toggle.querySelector('span:first-child').textContent = 'View Offer Details';
  } else {
    section.classList.add('expanded');
    toggle.classList.add('active');
    toggle.querySelector('span:first-child').textContent = 'Hide Offer Details';
  }
};


// Update Summary Selected Offer when offer card is clicked
/*
// DISABLED BY REQUEST: Clicking the card triggers selection logic, preventing "Select This Offer" button from being the sole trigger.
document.addEventListener('click', function (e) {
  const offerItem = e.target.closest('.offer-item');
  if (offerItem) {
    // Wait a moment for details to update, then get the proper offer name
    setTimeout(() => {
      // Get the actual offer name from the details header (more accurate)
      let offerName = document.getElementById('detailsPlanName')?.textContent?.trim() ||
        document.getElementById('modalDetailsPlanName')?.textContent?.trim() ||
        offerItem.querySelector('.offer-name')?.textContent?.trim();

      if (offerName) {
        const chosenOfferEl = document.getElementById('chosenOffer');
        if (chosenOfferEl) {
          chosenOfferEl.textContent = offerName;
        }
        // Also update global state
        if (!window.surveyResponses) window.surveyResponses = {};
        window.surveyResponses.selectedOffer = offerName;
        window.chosenOfferName = offerName;
        localStorage.setItem('selected_offer_backup', offerName);
      }
    }, 100); // Small delay to let details update first
  }
});
*/


// Default Offer Selection Logic
window.addEventListener('load', function () {
  setTimeout(() => {
    // Check if we already have a selection
    // We check surveyResponses, localStorage, and if any card already has the 'selected' class (visual check)
    const hasSelection = (window.surveyResponses && window.surveyResponses.selectedOffer) ||
      localStorage.getItem('selected_offer_backup') ||
      document.querySelector('.offer-item.selected');

    if (!hasSelection) {
      const defaultOfferName = 'Start Smart, Scale Fast';
      const offerItems = document.querySelectorAll('.offer-item');

      // Find the card to make active
      const defaultCard = Array.from(offerItems).find(item =>
        item.querySelector('.offer-name')?.textContent.trim() === defaultOfferName
      );

      if (defaultCard) {
        // console.log('Applying default offer selection:', defaultOfferName);

        // 1. Visually handle the card state
        offerItems.forEach(i => i.classList.remove('active')); // Remove active from others
        defaultCard.classList.add('active'); // Add active to default

        // 2. Show details section
        const detailsSection = document.getElementById('offerDetailsSection');
        if (detailsSection) detailsSection.style.display = 'block';

        // 3. Update details content (This populates the name selectCurrentOffer reads)
        if (typeof updateOfferDetailsDisplay === 'function') {
          updateOfferDetailsDisplay(defaultOfferName);
        }

        // 4. Trigger the actual selection logic
        // We wait a tiny bit to ensure DOM updates from step 3 are rendered
        setTimeout(() => {
          const selectBtn = document.getElementById('choosePlanBtnDesktop');
          if (typeof window.selectCurrentOffer === 'function') {
            window.selectCurrentOffer(selectBtn);

            // FORCE VISIBILITY OF DOWNLOAD SECTION for default offer
            // This ensures the "Download PDF" button appears immediately without needing a manual click
            const downloadSection = document.querySelector('.complete-purchase-section');
            const termsSection = document.querySelector('.terms-section');
            if (downloadSection) downloadSection.style.display = 'block';
            if (termsSection) termsSection.style.display = 'block';
            // console.log('Default offer selection logic executed.');

            // FORCE UPDATE SIDEBAR: Ensure visual consistency
            const chosenOfferEl = document.getElementById('chosenOffer');
            if (chosenOfferEl) {
              chosenOfferEl.textContent = defaultOfferName;
              chosenOfferEl.style.color = '#e50215'; // Match the button color for emphasis
              chosenOfferEl.style.fontWeight = 'bold';
            }
          } else if (selectBtn) {
            // Fallback if function not found on window (unlikely)
            selectBtn.click();
          }
        }, 50);
      }
    } else {
      // console.log('Offer already selected, skipping default selection.');
    }
  }, 1000);
});
