export default function checkAgent() {
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        return "cover"
    } else {
        return "contain"
    }
}