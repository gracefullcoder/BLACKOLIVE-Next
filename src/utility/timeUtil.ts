export const formatTime = (time: any): string => {
    let [hrs, min] = time.split(":").map(Number);

    let period = "AM";
    if (hrs >= 12) {
        period = "PM";
        if (hrs > 12) hrs -= 12;
    } else if (hrs === 0) {
        hrs = 12;
    }

    return `${hrs.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')} ${period}`;
};


