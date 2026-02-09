

// ========================================
// STICKY REFINEMENT BAR FUNCTIONALITY
// ========================================

// Initialize sticky refinement bar
function initStickyRefinementBar() {
    const stickyBar = document.getElementById('refinement-sticky-bar');
    if (!stickyBar) return;

    const stickyBarOffset = stickyBar.offsetTop;
    const packagesSection = document.querySelector('.packages-section') ||
        document.getElementById('plans-scroll') ||
        document.querySelector('[id*="package"]') ||
        document.querySelector('.offers-grid-container');

    let packagesTop = packagesSection ? packagesSection.offsetTop : Infinity;

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add sticky class when scrolled past the bar
        if (scrollTop > stickyBarOffset && scrollTop < (packagesTop - 200)) {
            stickyBar.classList.add('is-sticky');
        } else {
            stickyBar.classList.remove('is-sticky');
        }
    }

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', () => {
        packagesTop = packagesSection ? packagesSection.offsetTop : Infinity;
    });
}

// Scroll to services function
function scrollToServices() {
    const servicesSection = document.getElementById('service_section') ||
        document.querySelector('.alacrity-services-container') ||
        document.querySelector('[class*="service"]');

    if (servicesSection) {
        const offset = 100; // Offset for sticky header
        const elementPosition = servicesSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    } else {
        console.log('Services section not found');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Small delay to ensure layout is calculated
    setTimeout(initStickyRefinementBar, 500);
});
