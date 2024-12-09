// 获取DOM元素
const hourHand = document.querySelector('.hour');
const minuteHand = document.querySelector('.minute');
const digitalTime = document.querySelector('.time');
const hourInput = document.getElementById('hour-input');
const minuteInput = document.getElementById('minute-input');
const setTimeBtn = document.getElementById('set-time');
const presetBtns = document.querySelectorAll('.preset-btn');
const themeToggle = document.querySelector('.theme-toggle');
const modeToggle = document.getElementById('mode-toggle');
const timeControls = document.querySelector('.time-controls');
const presetTimes = document.querySelector('.preset-times');
const showAnswerBtn = document.getElementById('show-answer');

// 时钟模式
let isRealTime = false;
let clockInterval = null;

// 生成分钟刻度
function createMinuteMarks() {
    const minuteMarks = document.querySelector('.minute-marks');
    for (let i = 0; i < 60; i++) {
        const mark = document.createElement('div');
        mark.className = 'minute-mark';
        mark.style.transform = `rotate(${i * 6}deg)`;
        
        if (i % 5 === 0) {  // 5分钟刻度
            mark.style.height = '10px';  // 5分钟刻度长一些
            mark.style.width = '2px';    // 5分钟刻度粗一些
        } else {  // 普通分钟刻度
            mark.style.height = '6px';   // 普通刻度短一些
            mark.style.width = '1px';    // 普通刻度细一些
        }
        
        minuteMarks.appendChild(mark);
    }
}

// 设置时钟指针和数字显示
function setClockTime(hours, minutes, shouldUpdateInputs = false) {
    // 确保小时在1-12之间
    hours = ((hours - 1) % 12) + 1;
    // 确保分钟在0-59之间
    minutes = minutes % 60;

    // 计算指针角度
    const hourDegrees = ((hours % 12) * 30) + (minutes / 2);
    const minuteDegrees = minutes * 6;

    // 更新指针位置
    hourHand.style.transform = `translateX(-50%) rotate(${hourDegrees}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minuteDegrees}deg)`;

    // 更新数字显示
    digitalTime.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    if (!isRealTime) {
        // 在学习模式下才更新输入框
        if (shouldUpdateInputs) {
            hourInput.value = hours;
            minuteInput.value = minutes;
        } else {
            // 清空输入框
            hourInput.value = '';
            minuteInput.value = '';
        }
        // 隐藏时间显示，显示答案按钮
        digitalTime.classList.add('hidden');
        showAnswerBtn.classList.remove('hidden');
    }
}

// 更新实时时钟
function updateRealTimeClock() {
    const now = new Date();
    const hours = now.getHours() % 12 || 12; // 转换为12小时制
    const minutes = now.getMinutes();
    setClockTime(hours, minutes);
    // 在实时模式下始终显示时间
    digitalTime.classList.remove('hidden');
}

// 切换时钟模式
function toggleClockMode() {
    isRealTime = !isRealTime;
    
    if (isRealTime) {
        // 切换到实时模式
        modeToggle.textContent = '切换到学习模式';
        modeToggle.classList.add('real-time');
        timeControls.classList.add('disabled');
        presetTimes.classList.add('disabled');
        showAnswerBtn.classList.add('hidden');
        digitalTime.classList.remove('hidden');
        
        // 立即更新一次时间并启动定时器
        updateRealTimeClock();
        clockInterval = setInterval(updateRealTimeClock, 1000);
    } else {
        // 切换到学习模式
        modeToggle.textContent = '切换到实时模式';
        modeToggle.classList.remove('real-time');
        timeControls.classList.remove('disabled');
        presetTimes.classList.remove('disabled');
        
        // 停止定时器
        if (clockInterval) {
            clearInterval(clockInterval);
            clockInterval = null;
        }
        
        // 重置为默认时间
        setClockTime(12, 0);
    }
}

// 显示答案
function showAnswer() {
    digitalTime.classList.remove('hidden');
    showAnswerBtn.classList.add('hidden');
    hourInput.value = parseInt(digitalTime.textContent.split(':')[0]);
    minuteInput.value = parseInt(digitalTime.textContent.split(':')[1]);
}

// 处理时间设置按钮点击
setTimeBtn.addEventListener('click', () => {
    if (!isRealTime) {
        const hours = parseInt(hourInput.value) || 12;
        const minutes = parseInt(minuteInput.value) || 0;
        setClockTime(hours, minutes, false);  // 不更新输入框
    }
});

// 处理预设时间按钮点击
presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!isRealTime) {
            const hours = parseInt(btn.dataset.hour);
            const minutes = parseInt(btn.dataset.minute);
            setClockTime(hours, minutes, false);  // 不更新输入框
        }
    });
});

// 主题切换
let isDark = false;
themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
});

// 模式切换
modeToggle.addEventListener('click', toggleClockMode);

// 显示答案按钮点击
showAnswerBtn.addEventListener('click', showAnswer);

// 初始化
createMinuteMarks();
setClockTime(12, 0, true); // 默认显示12:00，并更新输入框
