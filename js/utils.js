const degFromRad = (rad) => (rad * 180 / Math.PI);
const radFromDeg = (deg) => (deg * Math.PI / 180);

const select = (query) => document.querySelector(query)

const random = (min = 1, max = 0) => {
    const x = Math.random() * Math.abs(max - min);
    return max != 0 ? min + x : min - x;
}