/**
 * LEGACY PDF GENERATION LOGIC (Backed up on 2026-01-20)
 * Extracted from app.js
 */

async function generatePDF(val, includeHiddenCosts = false) {
  // console.log('generatePDF called with includeHiddenCosts:', includeHiddenCosts);
  try {
    if (!window.estimateData) {
      alert('Please generate an estimate first');
      return;
    }

    // Initialize data and libraries
    const surveyResponses = window.surveyResponses || {};
    const selectedRooms = surveyResponses.selectedRooms || {};
    const selectedCategory = surveyResponses.selectedCategory;
    const data = window.estimateData || {};
    // Inject architecture details from surveyResponses (Frontend State)
    if (surveyResponses && surveyResponses.architectureDetails) {
      data.architectureDetails = surveyResponses.architectureDetails;
    }

    // Validate required libraries
    if (typeof window.jspdf === 'undefined' || typeof QRCode === 'undefined') {
      alert('PDF libraries not available. Please refresh and try again.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let rd = Math.floor(1000 + Math.random() * 9000);


    var urlx = "https://wa.me/919665017607?text=Hi%21+I%27ve+got+my+claim+code%3A+CLAIM-" + rd + ".+Looking+forward+to+unlocking+my+rewards%21";;
    // Configuration
    const config = {
      colors: {
        primary: [61, 90, 128],
        secondary: [239, 35, 35],
        accent: [0, 100, 0],
        text: [51, 51, 51],
        lightText: [120, 120, 120],
        lightBg: [245, 245, 245],
        white: [255, 255, 255],
        lightBlue: [220, 240, 255],
        lightYellow: [255, 248, 220]
      },
      layout: {
        leftMargin: 20,
        rightMargin: 190,
        lineHeight: 8,
        sectionSpacing: 15,
        valueStart: 85,
        bottomMargin: 30
      },
      urls: {
        referral: 'https://alacritys.in/gift-free-design-consultation/',
        current: urlx,
        claim: urlx
      },
      images: {
        letterhead: 'assets/images/letterhead.jpg',
        diamond: 'assets/images/2d_diamond.png',
        checkmark: 'assets/images/checkmark.png',
        iconTarget: 'assets/images/icon_target.png',
        iconGift: 'assets/images/icon_gift.png',
        iconDining: 'assets/images/icon_dining.png'
      }
    };

    // <-- Changed initial y to 60 so header text doesn't overlap the letterhead image (which is 50 high) -->
    let y = 60;
    const { leftMargin, rightMargin, lineHeight, sectionSpacing, valueStart, bottomMargin } = config.layout;
    const docPageHeight = doc.internal.pageSize.height;

    // Utility Functions
    const safeGet = (obj, path, defaultValue = 'Not specified') => {
      try {
        const parts = path.split('.');
        let o = obj;
        for (let p of parts) {
          if (o == null || o[p] == null) return defaultValue;
          o = o[p];
        }
        return o || defaultValue;
      } catch (e) {
        return defaultValue;
      }
    };

    const safeToLocaleString = (num) => {
      if (num === null || num === undefined || isNaN(num)) return '0';
      return num.toLocaleString();
    };

    const insertLetterhead = () => {
      doc.addImage(config.images.letterhead, 'PNG', 0, 0, 210, 50);
      // ensure y is below the letterhead whenever we insert it
      y = 60;
    };

    const checkPageBreak = (requiredSpace = 20) => {
      if (y + requiredSpace > docPageHeight - bottomMargin) {
        doc.addPage();
        insertLetterhead();
        y = 60;
      }
    };

    const addSectionHeader = (title, fontSize = 14) => {
      checkPageBreak(25);
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...config.colors.primary);

      // Add subtle background
      doc.setFillColor(...config.colors.lightBlue);
      doc.rect(leftMargin - 5, y - 8, rightMargin - leftMargin + 10, 15, 'F');

      doc.text(title, leftMargin, y);
      y += lineHeight + 5;
    };

    const addDetailRow = (label, value, bold = false) => {
      checkPageBreak(15);
      doc.setFontSize(11);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setTextColor(...config.colors.text);

      // Label
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, leftMargin, y);

      // Value with proper wrapping
      doc.setFont('helvetica', 'normal');
      //   const lines = doc.splitTextToSize(value, 100);
      //   doc.text(lines, valueStart, y);
      //   y += (lines.length * 6) + 6;
      const lines = doc.splitTextToSize(value, 120); // slightly larger width
      const lineHeight = 4.5; // matches font size 11
      lines.forEach(line => {
        doc.text(line.trim(), valueStart, y);
        y += lineHeight;
      });
      y += 2; // optional spacing between rows

    };

    const addPlaceholderMessage = (message, isImportant = false) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      if (isImportant) {
        doc.setTextColor(...config.colors.secondary);
      } else {
        doc.setTextColor(...config.colors.lightText);
      }


      if (isImportant) {
        doc.setFillColor(...config.colors.lightYellow);
        doc.rect(leftMargin - 3, y - 5, rightMargin - leftMargin + 6, 15, 'F');
      }

      const lines = doc.splitTextToSize(message, 150);
      lines.forEach(line => {
        doc.text(line, leftMargin + 5, y);
        y += 6;
      });
      y += 8;
    };

    // Generate QR codes
    let referralQRCodeDataURL = null;
    let currentPageQRCodeDataURL = null;
    try {
      referralQRCodeDataURL = await QRCode.toDataURL(config.urls.referral);
      currentPageQRCodeDataURL = await QRCode.toDataURL(config.urls.current);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
    }

    // Fetch room features data (or use pre-loaded global promise)
    const getRoomFeaturesData = async () => {
      try {
        // Use global raw promise if available (from compare section), otherwise fetch new
        let rawPromise = window.rawRoomFeaturesPromise;

        if (!rawPromise) {
          console.warn('rawRoomFeaturesPromise not found, fetching new...');
          rawPromise = fetch('assets/api/getRoomFeatures.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              selectedRooms: selectedRooms,
              selectedCategory: selectedCategory,
              selectedStyles: surveyResponses.selectedStyles || [],
              projectType: surveyResponses.projectType
            })
          }).then(response => response.json());
        }

        const data = await rawPromise;

        if (data && data.success) {

          // Ensure Compare Descriptions are updated (safeguard)
          if (typeof updateComparePackageDescriptions === 'function') {
            updateComparePackageDescriptions();
          }

          const categoryMap = {
            standard: 'standard_cat',
            premium: 'premium_cat',
            luxury: 'luxury_cat'
          };

          // Robust Category Handling: Default to 'standard' if 'personalized' or undefined
          let currentCat = (selectedCategory || 'Standard').toLowerCase();
          if (!categoryMap[currentCat]) {
            currentCat = 'standard';
          }
          const categoryKey = categoryMap[currentCat];

          const filteredRoomFeatures = {};
          stylesData = data.styles || [];

          Object.keys(data.roomFeatures).forEach(roomType => {
            const room = data.roomFeatures[roomType];
            filteredRoomFeatures[roomType] = {
              quantity: room.quantity,
              features: room.features.map(f => ({
                room_item: f.room_item,
                // Access the correct category column
                description: f[categoryKey] || f.description || ''
              }))
            };
          });

          return filteredRoomFeatures;
        }
        return {};
      } catch (error) {
        console.error('Error fetching room features:', error);
        return {};
      }
    };

    const roomFeaturesPromise = getRoomFeaturesData();

    // Save data to database
    saveDataForPDFDownload();

    // Set PDF properties
    doc.setProperties({
      title: `${safeGet(data, 'clientDetails.firstName', 'Client')} Interior Design Estimate`,
      subject: 'Detailed Cost Breakdown',
      author: 'Alacritys Design Studio',
      creator: 'Alacritys Design Studio'
    });

    // Initialize document
    insertLetterhead();

    // DOCUMENT HEADER
    checkPageBreak(25);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...config.colors.primary);
    doc.text('INTERIOR DESIGN ESTIMATE', 105, y, { align: 'center' });
    y += 25;

    // CLIENT INFORMATION SECTION
    addSectionHeader('CLIENT INFORMATION');

    const clientName = `${safeGet(data, 'clientDetails.firstName')} ${safeGet(data, 'clientDetails.lastName')}`.trim();
    if (clientName === 'Not specified Not specified' || !clientName) {
      addPlaceholderMessage('Client name not provided. Please update your profile for personalized service.', true);
    } else {
      addDetailRow('Full Name', clientName);
    }

    const location = safeGet(data, 'clientDetails.city');
    if (location === 'Not specified') {
      addPlaceholderMessage('Location not specified. Adding your city helps us provide localized services and accurate pricing.');
    } else {
      addDetailRow('Location', location);
    }

    const projectType = safeGet(data, 'clientDetails.projectType');
    addDetailRow('Project Type', projectType === 'Not specified' ? 'Home Interior (Default)' : projectType);

    y += sectionSpacing;

    // PROJECT DETAILS SECTION
    addSectionHeader('PROJECT OVERVIEW');

    const projectDetails = [
      {
        label: 'Project Scope',
        value: document.getElementById('summaryProjectType')?.textContent || projectType,
        placeholder: 'Complete home interior design and execution'
      },
      {
        label: 'Number of Rooms',
        value: document.getElementById('summaryNumRooms')?.textContent,
        placeholder: 'Please specify room count for accurate planning'
      },
      {
        label: 'Total Carpet Area',
        // FIXED: Use data object directly, not DOM element
        value: `${safeToLocaleString(safeGet(data, 'costBreakdown.areaCalculations.total_room_area', 0))} sqft`,
        placeholder: 'Area measurement required for material calculation'
      },
      {
        label: 'Design Style',
        value: document.getElementById('summaryStyle')?.textContent ||
          safeGet(data, 'designPreferences.selectedStyle'),
        placeholder: 'Contemporary design style (can be customized)'
      },
      {
        label: 'Design Category',
        value: document.getElementById('summaryDesignCategory')?.textContent ||
          safeGet(data, 'designPreferences.selectedCategory', 'Standard'),
        placeholder: 'Standard category selected'
      },
      {
        label: 'Estimated Investment',
        value: (() => {
          let val = document.getElementById('summaryCost')?.textContent;
          // Fallback to data if DOM is empty
          if (!val) {
            return (includeHiddenCosts ? `Rs. ${safeToLocaleString(safeGet(data, 'costBreakdown.final_project_cost', 0))}/-` : 'Contact for Quote');
          }
          // Sanitize: Replace symbols/garbled text with 'Rs.'
          if (val.includes('₹') || val.charCodeAt(0) > 127) {
            return val.replace(/[^\d.,]/g, '').trim().replace(/^/, 'Rs. ') + '/-';
          }
          return val;
        })(),
        placeholder: 'Custom quote based on requirements'
      }
    ];

    // --- HOUSE ARCHITECTURE SCOPE ---
    // Extract architecture details from nested JSON if needed
    let archDetails = data.architectureDetails;
    if (typeof archDetails === 'string') {
      try { archDetails = JSON.parse(archDetails); } catch (e) { }
    }

    if (archDetails && projectType === 'House Architecture') {
      if (archDetails.floors) {
        projectDetails.splice(1, 0, {
          label: 'Structure',
          value: archDetails.floors,
          placeholder: 'Number of floors not specified'
        });
      }
      if (archDetails.preConstruction && archDetails.preConstruction.length > 0) {
        projectDetails.push({
          label: 'Pre-Construction',
          value: Array.isArray(archDetails.preConstruction) ? archDetails.preConstruction.join(', ') : archDetails.preConstruction,
          placeholder: 'N/A'
        });
      }
    }
    // --------------------------------

    projectDetails.forEach(detail => {
      if (!detail.value || detail.value === 'Not specified' || detail.value === '₹0') {
        addDetailRow(detail.label, `${detail.placeholder} (Missing)`);
      } else {
        addDetailRow(detail.label, detail.value);
      }
    });

    y += sectionSpacing;

    // FIRST PROMOTIONAL SECTION
    const addPromotionalSection = (isFirstSection = true) => {
      checkPageBreak(140);
      y += 15;

      const promoStartY = y;
      const promoHeight = 120;
      const promoWidth = 170;

      // Background
      doc.setFillColor(...config.colors.white);
      // <-- Changed 'FD' to 'F' to prevent drawing the border/stroke. Fill only. -->
      doc.rect(leftMargin - 5, promoStartY - 5, promoWidth, promoHeight, 'F');

      const leftColX = leftMargin;
      const rightColX = 110;
      let leftY = promoStartY;
      let rightY = promoStartY;

      // LEFT COLUMN - Your Network = Your Rewards
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.addImage(config.images.diamond, 'PNG', leftColX, leftY - 5, 6, 6);
      doc.text('Your Network =', leftColX + 8, leftY);
      leftY += 8;
      doc.text('Your Rewards!', leftColX, leftY);
      leftY += 12;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text('Invite friends & unlock', leftColX, leftY);
      leftY += 6;
      doc.text('premium lifestyle perks', leftColX, leftY);
      leftY += 12;

      const referralBenefits = [
        "1 Referral: Luxury Décor Hamper",
        "2 Referrals: Taj Staycation Voucher",
        "3 Referrals: Rewards worth up to",
        "Rs. 1 Lakh on Interiors"
      ];

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      var kk = 0;
      referralBenefits.forEach(benefit => {
        if (kk < 3) {
          doc.addImage(config.images.checkmark, 'PNG', leftColX, leftY - 4, 5, 5);
          doc.text(benefit, leftColX + 8, leftY);
          leftY += 8;
        }
        kk++;
      });

      // Refer button
      leftY += 8;
      const referBtnWidth = 45;
      const referBtnHeight = 12;

      doc.setFillColor(...config.colors.secondary);
      doc.rect(leftColX, leftY - 4, referBtnWidth, referBtnHeight, 'F');
      doc.setTextColor(...config.colors.white);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Refer & Earn Now', leftColX + 3, leftY + 4);
      doc.link(leftColX, leftY - 4, referBtnWidth, referBtnHeight, { url: config.urls.referral });

      // QR code for referral
      if (referralQRCodeDataURL) {
        const qrSize = 25;
        doc.addImage(referralQRCodeDataURL, 'PNG', leftColX + referBtnWidth + 10, leftY - 10, qrSize, qrSize);
      }

      // RIGHT COLUMN - Premium Benefits
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Unlock Premium', rightColX, rightY);
      rightY += 8;
      doc.text('Benefits Today!', rightColX, rightY);
      rightY += 12;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text('Complete your estimate to', rightColX, rightY);
      rightY += 6;
      doc.text('claim these exclusive perks', rightColX, rightY);
      rightY += 12;

      const premiumBenefits = [
        { text: 'Free 3D Design Consultation', icon: config.images.iconTarget },
        { text: 'Luxury Décor Goodies', icon: config.images.iconGift },
        { text: 'Taj Dining Vouchers', icon: config.images.iconDining }
      ];

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      premiumBenefits.forEach(benefit => {
        doc.addImage(benefit.icon, 'PNG', rightColX, rightY - 4, 5, 5);
        doc.text(benefit.text, rightColX + 8, rightY);
        rightY += 9;
      });

      // Claim button
      rightY += 8;
      const claimBtnWidth = 45;
      const claimBtnHeight = 12;

      doc.setFillColor(...config.colors.secondary);
      doc.rect(rightColX, rightY - 4, claimBtnWidth, claimBtnHeight, 'F');
      doc.setTextColor(...config.colors.white);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Claim My Rewards', rightColX + 3, rightY + 4);
      doc.link(rightColX, rightY - 4, claimBtnWidth, claimBtnHeight, { url: config.urls.claim });

      // QR code for current page
      if (currentPageQRCodeDataURL) {
        const qrSize = 25;
        doc.addImage(currentPageQRCodeDataURL, 'PNG', rightColX + claimBtnWidth + 10, rightY - 10, qrSize, qrSize);
      }

      // Footer bar
      const footerBarY = promoStartY + promoHeight - 15;
      doc.setFillColor(...config.colors.secondary);
      doc.rect(0, footerBarY, 210, 15, 'F');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...config.colors.white);

      const footerText1 = `Scan QR codes to access: ${config.urls.current}`;
      const footerText2 = 'Contact: +91-919665017607 | Email: info@alacritydesign.com';

      const centerX1 = (doc.internal.pageSize.width - doc.getTextWidth(footerText1)) / 2;
      const centerX2 = (doc.internal.pageSize.width - doc.getTextWidth(footerText2)) / 2;

      doc.text(footerText1, centerX1, footerBarY + 8);
      doc.text(footerText2, centerX2, footerBarY + 12);

      y = promoStartY + promoHeight + 20;
    };

    // Add first promotional section
    addPromotionalSection(true);

    // REQUIRED SERVICES SECTION
    addSectionHeader('REQUIRED SERVICES');

    const servicesAccordionContent = document.getElementById('servicesOrderedList');
    if (servicesAccordionContent && servicesAccordionContent.children.length > 0) {
      const serviceItems = Array.from(servicesAccordionContent.children).map(li => {
        let text = li.textContent;
        // Strip price from Client PDF (e.g. "Service - ₹500" -> "Service")
        if (!includeHiddenCosts) {
          text = text.replace(/ - .*$/, '').trim();
        }
        return text;
      });
      serviceItems.forEach((service, index) => {
        checkPageBreak(15);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...config.colors.text);

        const lines = doc.splitTextToSize(`${index + 1}. ${service}`, 150);
        lines.forEach(line => {
          doc.text(line, leftMargin + 5, y);
          y += 6;
        });
        y += 4;
      });
    } else {
      addPlaceholderMessage('No specific services selected. Our team will recommend essential services based on your project requirements.');
    }

    y += 8;
    y += 8;
    // Only show Service Cost if requested (e.g. for Admin)
    if (includeHiddenCosts) {
      const totalServiceCost = document.getElementById('totalServiceCost')?.textContent || '₹0';
      addDetailRow('Total Service Investment', totalServiceCost === '₹0' ? 'To be determined based on selected services' : totalServiceCost, true);
    }

    y += sectionSpacing;

    // OFFER SERVICES SECTION
    addSectionHeader('SPECIAL OFFERS & BONUSES');

    const offerServicesAccordionContent = document.getElementById('offerServicesOrderedList');
    if (offerServicesAccordionContent && offerServicesAccordionContent.children.length > 0) {
      const offerServiceItems = Array.from(offerServicesAccordionContent.children).map(li => li.textContent);
      offerServiceItems.forEach((service, index) => {
        checkPageBreak(15);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...config.colors.text);

        const lines = doc.splitTextToSize(`${service}`, 150);
        lines.forEach(line => {
          doc.text(line, leftMargin + 5, y);
          y += 6;
        });
        y += 4;
      });
    } else {
      addPlaceholderMessage('Special promotional offers will be available based on your project scope and timing. Contact us to explore current deals!');
    }

    y += 8;

    const selectedOffer = document.getElementById('chosenOffer')?.textContent || 'None';
    if (selectedOffer && selectedOffer !== 'None' && selectedOffer.trim() !== '') {
      addDetailRow('Selected Offer', selectedOffer, true);

      const totalAmountToPay = document.getElementById('totalAmountToPay')?.textContent || '₹0';

      // Only show Final Amount line if explicitly requested (e.g. for Admin)
      if (includeHiddenCosts) {
        addDetailRow('Final Amount After Offer', totalAmountToPay, true);
      }
    } else {
      addPlaceholderMessage('Tip: Select an offer package to maximize your savings and get additional benefits!');
    }

    y += sectionSpacing;

    // ESTIMATE TOTAL SECTION
    const estimateTotal = safeGet(data, 'costBreakdown.final_project_cost', 0);
    if (estimateTotal > 0) {
      addSectionHeader('INVESTMENT BREAKDOWN');
      // ALWAYS SHOW Breakdown in Client PDF (Requested by User)
      // Use 'Rs.' instead of symbol to avoid PDF encoding issues
      addDetailRow('Material + Labour Cost', `Rs. ${safeToLocaleString(estimateTotal)}/-`, true);
    } else {
      addSectionHeader('INVESTMENT SUMMARY');
      addPlaceholderMessage('Detailed cost breakdown will be provided after finalizing room selections and design preferences. Get a personalized quote today!', true);
    }

    y += sectionSpacing;

    // PAYMENT TERMS SECTION
    addSectionHeader('PAYMENT TERMS & CONDITIONS');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...config.colors.text);

    const paymentTerms = [
      '50% advance payment required to initiate project',
      '30% payment after material procurement and delivery',
      '20% final payment upon successful project completion',
      'Multiple payment options: UPI, Card, NEFT, or Bank Transfer',
      'All payments include GST as applicable',
      '100% satisfaction guaranteed with 1-year warranty'
    ];

    paymentTerms.forEach(term => {
      checkPageBreak(15);
      const lines = doc.splitTextToSize(term, 165);
      lines.forEach(line => {
        doc.text(line, leftMargin, y);
        y += 6;
      });
      y += 4;
    });

    // Wait for room features and add them
    try {
      // alert('Debug: Awaiting Room Features...'); 
      let roomFeaturesData = {};
      if (typeof roomFeaturesPromise !== 'undefined') {
        roomFeaturesData = await roomFeaturesPromise;
        // alert('Debug: Room Features Loaded: ' + (roomFeaturesData ? Object.keys(roomFeaturesData).length : 'None'));
      } else {
        console.warn('roomFeaturesPromise is undefined in this context.');
      }

      if (roomFeaturesData && Object.keys(roomFeaturesData).length > 0) {
        // ROOM FEATURES SECTION
        doc.addPage();
        insertLetterhead();
        y = 60;

        addSectionHeader('DETAILED ROOM FEATURES', 12);
        doc.text('Customized features based on your selected Material & Finish Package and preferences', 105, y, { align: 'center' });
        y += 20;

        Object.keys(roomFeaturesData).forEach((roomType, roomIndex) => {
          const roomData = roomFeaturesData[roomType];

          checkPageBreak(40);

          // Room header
          const roomHeaderY = y;
          const roomHeaderHeight = 12;

          doc.setFillColor(...config.colors.lightBlue);
          doc.rect(leftMargin - 5, roomHeaderY - 8, rightMargin - leftMargin + 10, roomHeaderHeight, 'F');

          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...config.colors.primary);
          const roomTitle = roomType.toUpperCase().replace('_', ' ');
          if (roomData.quantity > 1) {
            doc.text(`${roomTitle} (Quantity: ${roomData.quantity})`, leftMargin, roomHeaderY);
          } else {
            doc.text(roomTitle, leftMargin, roomHeaderY);
          }

          y += 18;

          if (roomData.features && roomData.features.length > 0) {
            // Filter features that have a valid description (Mirroring Comparison Section logic)
            const validFeatures = roomData.features.filter(f => {
              const desc = f.description || f.standard_cat || f.premium_cat || f.luxury_cat;
              return desc && desc.trim() !== '';
            });

            if (validFeatures.length > 0) {
              validFeatures.forEach((feature, featureIndex) => {

                // Calculate height strictly for this item to avoid premature page breaks
                const descriptionLines = doc.splitTextToSize(feature.description || feature.standard_cat || feature.premium_cat || feature.luxury_cat, 130);
                const itemHeight = Math.max(15, (descriptionLines.length * 5) + 10);

                // Check if this specific item fits (plus small buffer)
                checkPageBreak(itemHeight + 5);

                const itemBgColor = featureIndex % 2 === 0 ? [250, 250, 250] : [255, 255, 255];
                doc.setFillColor(...itemBgColor);

                doc.rect(leftMargin - 3, y - 5, rightMargin - leftMargin + 6, itemHeight, 'F');

                // Feature name
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...config.colors.secondary);
                doc.text(`${featureIndex + 1}. ${feature.room_item || 'Feature item'}`, leftMargin, y);

                y += 8;

                // Feature description
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(...config.colors.text);

                descriptionLines.forEach(line => {
                  doc.text(line, leftMargin + 5, y);
                  y += 5;
                });

                y += 8;
              });
            } else {
              addPlaceholderMessage('No specific features available for this room in the selected package.');
            }
          } else {
            addPlaceholderMessage('Room features will be customized based on your specific requirements and design preferences.');
          }

          y += 15;

          if (roomIndex < Object.keys(roomFeaturesData).length - 1) {
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(leftMargin, y - 8, rightMargin, y - 8);
            y += 5;
          }
        });

        // Room features summary
        checkPageBreak(50);
        y += 10;

        doc.setFillColor(...config.colors.lightBg);
        doc.rect(leftMargin - 5, y - 5, rightMargin - leftMargin + 10, 15, 'F');

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...config.colors.primary);
        doc.text('ROOM FEATURES SUMMARY', leftMargin, y + 5);

        y += 20;

        const totalRooms = Object.keys(roomFeaturesData).length;
        const totalFeatures = Object.values(roomFeaturesData)
          .reduce((sum, room) => {
            if (!room.features) return sum;
            // Count only valid features
            const validCount = room.features.filter(f => {
              const desc = f.description || f.standard_cat || f.premium_cat || f.luxury_cat;
              return desc && desc.trim() !== '';
            }).length;
            return sum + validCount;
          }, 0);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...config.colors.text);

        doc.text(`Total Rooms Covered: ${totalRooms}`, leftMargin + 5, y);
        y += 8;
        doc.text(`Total Features Listed: ${totalFeatures}`, leftMargin + 5, y);
        y += 8;
        doc.text(`Category: ${selectedCategory || 'Standard'} (Premium upgrades available)`, leftMargin + 5, y);
        y += 15;

        // Customization note
        checkPageBreak(30);
        doc.setFillColor(...config.colors.lightYellow);
        doc.rect(leftMargin - 5, y - 5, rightMargin - leftMargin + 10, 25, 'F');

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...config.colors.secondary);
        doc.text('Customization Note:', leftMargin, y + 5);

        // start description a bit lower
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...config.colors.text);

        const noteText = 'All room features are fully customizable according to your specific requirements, budget, and design preferences. Our design team will work with you to refine every detail.';
        const noteLines = doc.splitTextToSize(noteText, 150);

        let noteY = y + 12;  // shift down so it doesn't overlap heading
        noteLines.forEach(line => {
          doc.text(line, leftMargin + 15, noteY);
          noteY += 5;
        });

        y = noteY + 10; // push y further down for next section

      } else {
        // No room features available
        checkPageBreak(40);
        addSectionHeader('ROOM FEATURES');
        addPlaceholderMessage('🏠 Detailed room features will be provided after you complete the room selection survey. Each room will include comprehensive specifications tailored to your chosen design category.', true);
      }
    } catch (error) {
      console.error('Error processing room features:', error);
    }

    // Add second promotional section
    addPromotionalSection(false);

    // Add page footers
    const totalPages = doc.internal.getNumberOfPages();
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      doc.setPage(pageNum);

      const footerY = doc.internal.pageSize.height - 15;
      doc.setFontSize(8);
      doc.setTextColor(...config.colors.lightText);

      doc.text(`Generated: ${new Date().toLocaleDateString()}`, leftMargin, footerY);
      doc.text('Confidential - For Client Use Only', 105, footerY, { align: 'center' });
      doc.text(`Page ${pageNum} of ${totalPages}`, rightMargin, footerY, { align: 'right' });
    }

    // Save PDF
    const fullName = `${safeGet(data, 'clientDetails.firstName', '')} ${safeGet(data, 'clientDetails.lastName', '')}`.trim();
    const fileName = `${fullName.replace(/[^a-z0-9]/gi, '_') || 'Interior_Design'}_Estimate.pdf`;

    // alert('Debug: Saving PDF now...');
    doc.save(fileName);

    // Only redirect if NOT in admin mode
    // We assume hidden costs = admin mode for now, or check URL param if val=0 is ambiguous
    // For admin tool, includeHiddenCosts is true (or false for client view), but we can just check if we are in admin_mode via URL or pass a flag.
    // However, simplest logic: If we are doing this from admin panel, we probably don't want to leave the page.
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.get('admin_mode')) {
      if (val == 1) {
        window.location = 'assets/thankyou/thanks.html';
      }
      else {
        window.location = 'assets/thankyou/thank-you.html';
      }
    }


  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}
