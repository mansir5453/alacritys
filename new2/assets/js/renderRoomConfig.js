
// room config section
function renderRoomConfig(interiorType) {
    const container = document.getElementById('roomConfigContainer');
    if (!container) return;

    if (!interiorType || !Array.isArray(interiorType.rooms) || interiorType.rooms.length === 0) {
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
