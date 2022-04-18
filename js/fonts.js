window.onload = function() {
    var html = document.documentElement;

    var fontsfile = document.createElement('link');
    fontsfile.href = pathTemplate + 'css/fonts.css';
    fontsfile.rel = 'stylesheet';
    document.head.appendChild(fontsfile);

    if (sessionStorage.fontsLoaded) {
        html.classList.add('fonts-loaded');
        window.setTimeout(function() { window.dispatchEvent(new Event('resize')); }, 500);
    } else {
        var script = document.createElement('script');
        script.src = pathTemplate + 'js/fontfaceobserver.js';
        script.async = true;

        script.onload = function () {
            var Roboto100 = new FontFaceObserver('Roboto', {
                weight: '100'
            });
            var Roboto300 = new FontFaceObserver('Roboto', {
                weight: '300'
            });
            var Roboto300i = new FontFaceObserver('Roboto', {
                weight: '300',
                style: 'italic'
            });
            var Roboto400 = new FontFaceObserver('Roboto', {
                weight: 'normal'
            });
            var Roboto500 = new FontFaceObserver('Roboto', {
                weight: '500'
            });
            var Roboto700 = new FontFaceObserver('Roboto', {
                weight: 'bold'
            });
            var Roboto700i = new FontFaceObserver('Roboto', {
                weight: 'bold',
                style: 'italic'
            });
            var Roboto900 = new FontFaceObserver('Roboto', {
                weight: '900'
            });
            var Oswald500 = new FontFaceObserver('Oswald', {
                weight: '500'
            });
            var Oswald700 = new FontFaceObserver('Oswald', {
                weight: 'bold'
            });
            var Montserrat400 = new FontFaceObserver('Montserrat', {
                weight: 'normal'
            });
            var Montserrat500 = new FontFaceObserver('Montserrat', {
                weight: '500'
            });
            var Montserrat700 = new FontFaceObserver('Montserrat', {
                weight: 'bold'
            });

            Promise.all([
                Roboto100.load(),
                Roboto300.load(),
                Roboto300i.load(),
                Roboto400.load(),
                Roboto500.load(),
                Roboto700.load(),
                Roboto700i.load(),
                Roboto900.load(),
                Oswald500.load(),
                Oswald700.load(),
                Montserrat400.load(),
                Montserrat500.load(),
                Montserrat700.load()
            ]).then(function () {
                html.classList.add('fonts-loaded');
                sessionStorage.fontsLoaded = true;
                window.setTimeout(function() { window.dispatchEvent(new Event('resize')); }, 500);
            });
        };
        document.head.appendChild(script);
    }
}