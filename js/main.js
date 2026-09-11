/* ==========================================================================
   N Hub - Main JavaScript Controller
   ========================================================================== */

$(document).ready(function () {
    // 1. Theme Management (LocalStorage Integration)
    const savedTheme = localStorage.getItem('nhub_theme') || 'dark';
    $('html').attr('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    $('#themeToggleBtn').on('click', function () {
        let currentTheme = $('html').attr('data-theme');
        let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        $('html').attr('data-theme', newTheme);
        localStorage.setItem('nhub_theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = $('#themeToggleBtn i');
        if (theme === 'light') {
            icon.removeClass('fa-adjust').addClass('fa-sun');
        } else {
            icon.removeClass('fa-sun').addClass('fa-adjust');
        }
    }

    // 2. Robust Ajax Platform Detail Fetcher
    $('.btn-ajax-details').on('click', function (e) {
        e.preventDefault();
        let jsonUrl = $(this).attr('data-platform');

        $('#ajaxModalTitle').text('جاري التحميل...');
        $('#ajaxModalContent').html(`
            <div class="text-center py-4">
                <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `);
        
        $('#ajaxDetailModal').modal('show');

        $.ajax({
            url: jsonUrl,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#ajaxModalTitle').text(data.title || 'تفاصيل المنصة');
                $('#ajaxModalContent').html(`
                    <div class="p-2">
                        <span class="badge bg-success mb-2">${data.category || 'عام'}</span>
                        <p class="lead fs-6">${data.description || ' لا يوجد وصف متاح.'}</p>
                        <hr>
                        <div class="d-flex justify-content-between align-items-center">
                            <strong>السعر:</strong>
                            <span class="text-success fw-bold">${data.price || 'مجاني'}</span>
                        </div>
                        <div class="mt-2">
                            <strong>التوفر:</strong> ${data.availability || 'متاح'}
                        </div>
                    </div>
                `);
            },
            error: function (xhr, status, error) {
                console.error("Ajax Error Details:", status, error);
                $('#ajaxModalTitle').text('خطأ في التحميل');
                $('#ajaxModalContent').html(`
                    <div class="alert alert-danger mb-0" role="alert">
                        <strong>تعذر جلب البيانات!</strong><br>
                        يرجى التأكد من وجود الملف <code>${jsonUrl}</code> في المجلد المخصص واستخدامه عبر سيرفر محلي (Live Server).
                    </div>
                `);
            }
        });
    });

    // 3. Store Category Filter Logic
    $('.filter-btn').on('click', function () {
        $('.filter-btn').removeClass('btn-custom-accent').addClass('btn-outline-secondary');$(this).removeClass('btn-outline-secondary').addClass('btn-custom-accent');

        let filterValue = $(this).attr('data-filter');

        if (filterValue === 'all') {
            $('.platform-item').removeClass('d-none').hide().fadeIn(300);
        } else {
            $('.platform-item').addClass('d-none');$(`.platform-item[data-category="${filterValue}"]`).removeClass('d-none').hide().fadeIn(300);
        }
    });

    // 4. Toast Notification Utility
    window.showToast = function (title, message) {
        $('#toastTitle').text(title);
        $('#toastMessage').text(message);
        let toastElement = document.getElementById('liveToast');
        if (toastElement) {
            let toast = new bootstrap.Toast(toastElement);
            toast.show();
        }
    };

    // 5. Live Search & Real-time Filtering
    $('.custom-search-input').on('keyup input', function () {
        let query = $(this).val().toLowerCase().trim();

        $('.speed-dial-card, .platform-item').each(function () {
            let cardText = $(this).text().toLowerCase();

            if (cardText.indexOf(query) !== -1) {
                $(this).closest('.col-12, .col-sm-6, .col-md-4, .col-lg-3, .platform-item').stop(true, true).fadeIn(200);
            } else {
                $(this).closest('.col-12, .col-sm-6, .col-md-4, .col-lg-3, .platform-item').stop(true, true).fadeOut(200);
            }
        });
    });

}); // <-- يوضع الكود قبل هذا القوس مباشرة
