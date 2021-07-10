import { BrowserWindow } from "electron";

const fadeWindowOut = (
    window: BrowserWindow,
    step = 0.1,
    fadeEveryXSeconds = 10
) => {

    return new Promise((resolve) => {

        let opacity = window.getOpacity();

        const interval = setInterval(() => {

            if (opacity <= 0 || !window || window.isDestroyed()) {

                clearInterval(interval);
                resolve(interval)
            }

            window.setOpacity(opacity);
            opacity -= step;
        }, fadeEveryXSeconds);

    })
}

const fadeWindowIn = (
    window: BrowserWindow,
    step = 0.1,
    fadeEveryXSeconds = 10
) => {

    return new Promise((resolve) => {

        let opacity = window.getOpacity();

        const interval = setInterval(() => {

            if (opacity >= 1 || !window || window.isDestroyed()) {

                clearInterval(interval);
                resolve(interval);
            }

            window.setOpacity(opacity);
            opacity += step;
        }, fadeEveryXSeconds);

    })
}

export { fadeWindowIn, fadeWindowOut };