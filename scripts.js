export const selectedColor = 0
const colorRow = document.getElementById('colorRow')
const themeButtons = [
    [0, "#e68e66", "#d15392"],
    [1, "#FDBB2D", "#3A1C71"],
    [2, "#FC466B", "#3F5EFB"],
    [3, "#8dc7ff", "#dfc5fc"],
    [4, "#333333", "#c997c9"],

];

export function loadColorButtons() {
    
    if (!colorRow) return;

    colorRow.innerHTML = themeButtons.map(([index, color1, color2]) => `
        <button type="button" name="color" class="colorCircle" data-set="${index}" style="background: linear-gradient(0.25turn, ${color1}, ${color2});;" aria-label="Theme Color Button"></button>
    `).join("");
}
export function clickColor () {
    colorRow.querySelectorAll('.colorCircle').forEach((button) => {
        button.addEventListener('click', () => {
            console.log("test")
            const [, color1, color2] = themeButtons[Number(button.dataset.set)];
            document.documentElement.style.setProperty(
                '--theme-gradient',
                `linear-gradient(0.25turn, ${color1}, ${color2})`
            )
        })
    })
}