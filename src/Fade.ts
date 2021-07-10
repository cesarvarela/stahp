import { BrowserWindow } from "electron";

const fadeWindowOut = (
    browserWindowToFadeOut: BrowserWindow,
    step = 0.1,
    fadeEveryXSeconds = 10
) => {

    return new Promise((resolve) => {

        let opacity = browserWindowToFadeOut.getOpacity();

        const interval = setInterval(() => {

            if (opacity <= 0) {

                clearInterval(interval);
                resolve(interval)
            }

            browserWindowToFadeOut.setOpacity(opacity);
            opacity -= step;
        }, fadeEveryXSeconds);

    })
}

const fadeWindowIn = (
    browserWindowToFadeIn: BrowserWindow,
    step = 0.1,
    fadeEveryXSeconds = 10
) => {

    return new Promise((resolve) => {

        let opacity = browserWindowToFadeIn.getOpacity();

        const interval = setInterval(() => {

            if (opacity >= 1) {

                clearInterval(interval);
                resolve(interval);
            }

            browserWindowToFadeIn.setOpacity(opacity);
            opacity += step;
        }, fadeEveryXSeconds);

    })
}

export { fadeWindowIn, fadeWindowOut };