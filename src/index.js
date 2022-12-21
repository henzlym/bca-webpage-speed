const root = document.querySelector('#bca-psi-root');

function run() {
    const url = setUpQuery();
    fetch(url)
        .then(response => response.json())
        .then(json => {
            // See https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed#response
            // to learn more about each of the properties in the response object.
            showInitialContent(json.id);
            const cruxMetrics = {
                "First Contentful Paint": json.loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.category,
                "First Input Delay": json.loadingExperience.metrics.FIRST_INPUT_DELAY_MS.category
            };
            showCruxContent(cruxMetrics);
            const lighthouse = json.lighthouseResult;
            console.log(json);
            const lighthouseMetrics = {
                'First Contentful Paint': lighthouse.audits['first-contentful-paint'].displayValue,
                'Speed Index': lighthouse.audits['speed-index'].displayValue,
                'Time To Interactive': lighthouse.audits['interactive'].displayValue,
                'First Meaningful Paint': lighthouse.audits['first-meaningful-paint'].displayValue
            };
            showLighthouseContent(lighthouseMetrics);
        });
}

function setUpQuery() {
    const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
    const parameters = {
        url: encodeURIComponent('https://sportsnaut.com') + '&',
        key: 'AIzaSyCx3TyJmlIjolXYK6dylWEDoaEOsuECbzk'
    };
    let query = `${api}?`;
    for (key in parameters) {
        query += `${key}=${parameters[key]}`;
    }
    return query;
}

function showInitialContent(id) {
    const page = document.createElement('p');
    page.textContent = `Page tested: ${id}`;
    root.appendChild(page);
}

function showCruxContent(cruxMetrics) {
    const cruxHeader = document.createElement('h2');
    cruxHeader.textContent = "Chrome User Experience Report Results";
    root.appendChild(cruxHeader);
    for (key in cruxMetrics) {
        const p = document.createElement('p');
        p.textContent = `${key}: ${cruxMetrics[key]}`;
        root.appendChild(p);
    }
}

function showLighthouseContent(lighthouseMetrics) {
    const lighthouseHeader = document.createElement('h2');
    lighthouseHeader.textContent = "Lighthouse Results";
    root.appendChild(lighthouseHeader);
    for (key in lighthouseMetrics) {
        const p = document.createElement('p');
        p.textContent = `${key}: ${lighthouseMetrics[key]}`;
        root.appendChild(p);
    }
}

run();