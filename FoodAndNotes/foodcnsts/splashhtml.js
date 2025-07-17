const splashhtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background: transparent;
            }
            .loader {
                position: relative;
                width: 100px;
                height: 100px;
                border-radius: 25px;
                transform-style: preserve-3d;
                mix-blend-mode: hard-light;
            }

            .circle {
                position: absolute;
                inset: 17px;
                background: #acbaca;
                border-radius: 50%;
                transform-style: preserve-3d;
                box-shadow:
                    2px 2px 7px 0 #152b4a66,
                    inset 2px 2px 2px rgba(255, 255, 255, 0.55),
                    -3px -3px 5px rgba(255, 255, 255, 1);
            }

            .circle::before {
                content: "";
                position: absolute;
                inset: 2px;
                background: linear-gradient(#2196f3, #e91e63);
                mix-blend-mode: color-burn;
                border-radius: 50%;
                animation: anim 2s linear infinite;
            }

            .circle::after {
                content: "";
                position: absolute;
                inset: 12px;
                filter: blur(0.9px);
                background: #ffffff;
                border-radius: 50%;
                z-index: 1000;
            }

            @keyframes anim {
                0% {
                    transform: rotate(0deg);
                    filter: blur(2px);
                }
                100% {
                    transform: rotate(360deg);
                    filter: blur(4px);
                }
            }
        </style>
    </head>
    <body>
        <div class="loader">
            <div class="circle"></div>
        </div>
    </body>
    </html>
`;

export default splashhtml;