var resizeHndl, scrollBottomFixed, scrollParent, wnd, doc, prevTracingDot;

$(function ($) {

    wnd = $(window);
    doc = $(document);
    scrollParent = $('.scrollParent');
    scrollBottomFixed = $('.scrollBottomFixed');


    $('body')
        .delegate('.bootstrap-select.filterSelect', 'hide.bs.dropdown', function () {
            $(this).closest('.hover-select-box').removeClass('opened');
        })
        .delegate('.bootstrap-select.filterSelect', 'click', function () {
            $(this).closest('.hover-select-box').addClass('opened');
        })
        .delegate('.filter-mod.hover-select-box .filterSelect.selectpicker', 'change', function () {
            $(this).closest('.filter-holder').addClass('current').siblings().removeClass('current');
        });

    $('.validateMe').validationEngine({
        //binded                   : false,
        scroll: false,
        showPrompts: true,
        showArrow: false,
        inlineValidation: true,
        addSuccessCssClassToField: 'success',
        addFailureCssClassToField: 'error',
        parentFieldClass: '.formCell',
        parentFormClass: '.formHolder',
        promptPosition: "centerRight",
        //doNotShowAllErrosOnSubmit: true,
        //focusFirstField          : false,
        autoHidePrompt: true,
        autoHideDelay: 2000,
        autoPositionUpdate: true,
        //prettySelect             : true,
        //useSuffix                : "_VE_field",
        addPromptClass: 'relative_mode only_1_msg',
        showOneMessage: false
    });
    
});

