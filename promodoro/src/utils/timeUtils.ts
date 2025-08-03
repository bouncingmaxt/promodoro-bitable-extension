export function formatTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let result = '';
    if (hours > 0) {
        result += `${hours}小时`;
    }
    if (minutes > 0) {
        result += `${minutes}分钟`;
    }
    if (remainingSeconds > 0 || result === '') {
        result += `${remainingSeconds}秒`;
    }
    return result;
}

export function formatSeconds(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
}

export function formatMinutes(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
        return `${hours}小时${remainingMinutes > 0 ? remainingMinutes + '分钟' : ''}`;
    }
    return `${remainingMinutes}分钟`;
}
