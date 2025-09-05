$(function () {
    var $form  = $('.calculator-form');
    var $income = $('#income');
    var $days   = $('#days');
    var $tb     = $('#tb');

    var $empDays = $('.js-emp-days');
    var $empAmt  = $('.js-emp-amount');
    var $hifDays = $('.js-hif-days');
    var $hifAmt  = $('.js-hif-amount');
    var $daily1  = $('.js-daily');
    var $daily2  = $('.js-daily-2');
    var $total   = $('.js-total');
    var $totalDaysLabel = $('.js-total-days');

    var $daysError = $('#daysError');

    var RATE = 0.70;
    var MONTH_DIVISOR = 37.5;

    function toEUR(n){
        var s = (Math.round(n*100)/100).toFixed(2).split('.');
        var int = s[0].replace(/\B(?=(\d{3})+(?!\d))/g,' ');
        return int + ',' + s[1];
    }
    function sInt(v){
        v = String(v).replace(',', '.');
        var n = parseInt(v,10);
        return isNaN(n) ? 0 : n;
    }
    function sFloat(v){
        v = String(v).replace(',', '.');
        var n = parseFloat(v);
        return isNaN(n) ? 0 : n;
    }

    function clearOutputs(){
        $empDays.text('0');
        $hifDays.text('0');
        $empAmt.text('0,00€');
        $hifAmt.text('0,00€');
        $daily1.text('0,00 €');
        $daily2.text('0,00 €');
        $total.text('0,00€');
        $totalDaysLabel.text('0');
    }

    function validateDays(days, hasTb){
        if (days <= 0) return {ok:false, message:'Please enter a positive number of days.'};
        if (!hasTb && days >= 183) return {ok:false, message:'Without tuberculosis the maximum covered duration is 182 days.'};
        if ( hasTb && days > 240)  return {ok:false, message:'With tuberculosis the maximum covered duration is 240 days.'};
        return {ok:true, message:''};
    }

    function computeAndRender(monthly, days){
        var employerDays = Math.min(5, Math.max(0, days - 3));
        var hifDays      = Math.max(0, days - 8);
        var daily = (monthly * RATE) / MONTH_DIVISOR;
        var empAmount = employerDays * daily;
        var hifAmount = hifDays * daily;
        var totalAmt  = empAmount + hifAmount;

        $empDays.text(employerDays);
        $hifDays.text(hifDays);
        var dailyStr = toEUR(daily) + ' €';
        $daily1.text(dailyStr);
        $daily2.text(dailyStr);
        $empAmt.text(toEUR(empAmount) + '€');
        $hifAmt.text(toEUR(hifAmount) + '€');
        $total.text(toEUR(totalAmt) + '€');
        $totalDaysLabel.text(days);
    }

    $form.on('submit', function(e){
        e.preventDefault();
        var monthly = sFloat($income.val());
        var days    = sInt($days.val());
        var hasTb   = $tb.is(':checked');

        var v = validateDays(days, hasTb);
        if (!v.ok) {
            $daysError.text(v.message).prop('hidden', false);
            clearOutputs();
            return;
        }
        $daysError.prop('hidden', true).text('');
        computeAndRender(monthly, days);
    });

    $days.on('input', function(){ $daysError.prop('hidden', true).text(''); });
    $tb.on('change', function(){
        var d = sInt($days.val());
        var v = validateDays(d, $tb.is(':checked'));
        if (!v.ok && d) $daysError.text(v.message).prop('hidden', false);
        else $daysError.prop('hidden', true).text('');
    });

    if (!$income.val()) $income.val(1500);
    if (!$days.val())   $days.val(7);
    clearOutputs();
});