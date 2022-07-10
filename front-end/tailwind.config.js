module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        fontFamily: {
            // 'sans': ['ui-sans-serif', 'system-ui', ...],
            // 'serif': ['ui-serif', 'Georgia', ...],
            // 'mono': ['ui-monospace', 'SFMono-Regular', ...],
            // 'display': ['Oswald', ...],
            // 'body': ['"Open Sans"', ...],
            'cursive': ['cursive']
        },
        extend: {
            colors: {
                'sea-green': '#2e8b57',
                'darkslategray': '#2F4F4F'
            },
            backgroundImage: () => ({
                'slightHeatHome': "url('images/xiaoshu/xiaoshuhome.jpg')",
                'slightHeatResult': "url('images/xiaoshu/xiaoshures.jpg')",
                'slightHeatDisp': "url('images/xiaoshu/xiaoshudisp.jpg')",
            }),
            spacing: {
                '1/10': '10%',
                '1/8': '12.5%',
                '3/20': '15%',
              }
        },
    },
    plugins: [],
}
