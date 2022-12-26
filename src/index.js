import { Panel, PanelBody, PanelHeader, PanelRow, TabPanel } from '@wordpress/components';
import { Fragment, render, useEffect, useState } from '@wordpress/element';
import { addQueryArgs, buildQueryString } from '@wordpress/url';

// import data from '../data.json';
import './editor.scss';

function setUpQuery() {
    const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
    let categoryQueryString = '',query = '';
    let categories = [ 'PERFORMANCE', 'ACCESSIBILITY', 'SEO', 'BEST_PRACTICES'];
    let queryString = buildQueryString( {
        url: 'https://sportsnaut.com',
        key: 'AIzaSyCx3TyJmlIjolXYK6dylWEDoaEOsuECbzk',
        strategy: 'MOBILE'
    } );
    
    
    categories.forEach( category => {
        categoryQueryString += `&category=${category}`;
    });

    query = api + '?' + queryString + categoryQueryString;

    return query;
}
function PanelIcon( props ) {

    const { displayValue, score } = props;
    let category = '';
    if (score>=0.9&&score<=1) {
        category = 'category-FAST'
    } else if(score>=0.6&&score<=0.89){
        category = 'category-AVERAGE'
    } else {
        category = 'category-SLOW'
    }
    
    if (!displayValue) {
        return null;
    }
    return(
        <div className={`psi-audit-score ${category}`}> - {displayValue}</div>
    )
}
function MetricPanel( props ){
    const { data:{ audits }, title } = props;
    
    return(
        
            audits.map( ( audit ) => {
                if (audit.score>=0.9 || audit.score == null) {
                    return null;
                }
                return(
                    <Panel className={`panel-${audit.id}`}>
                        <PanelBody title={ audit.title } icon={ <PanelIcon { ...audit }/> } initialOpen={ false }>
                            <p>{ audit.description }</p>
                        </PanelBody>
                    </Panel>
                );
            })
            
        
    )
}
function CoreWebVitals(props) {
    const { id: url, loadingExperience, lighthouseResult } = props;

    const [metrics, setMetrics] = useState([]);

    const crUx = {
        overallScore: loadingExperience.overall_category,
        metrics: [
            {
                name: "First Contentful Paint",
                category: loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.category,
                audit: lighthouseResult.audits["first-contentful-paint"]
            },
            {
                name: "Largest Contentful Paint",
                category: loadingExperience.metrics.LARGEST_CONTENTFUL_PAINT_MS.category,
                audit: lighthouseResult.audits["largest-contentful-paint"]
            },
            {
                name: "Cumulative Layout Shift",
                category: loadingExperience.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.category,
                audit: lighthouseResult.audits["cumulative-layout-shift"]
            }
        ]
    }

    return (
        <div class="psi-category">
            <h2 className="psi-category-title">Core Web Vitals</h2>
            <p className="psi-category-description">Each of the Core Web Vitals represents a distinct facet of the user experience, is measurable in the field, and reflects the real-world experience of a critical user-centric outcome. The metrics that make up Core Web Vitals will evolve over time. The current set for 2020 focuses on three aspects of the user experience—loading, interactivity, and visual stability—and includes the following metrics (and their respective thresholds):</p>
            <div class="psi-row psi-metrices">
                {crUx.metrics.map((metric) => {
                    return (
                        <div className="psi-card">
                            <h3 className="psi-card-title">{metric.name}</h3>
                            <div className={`psi-card-score category-${metric.category}`}>{metric.audit.displayValue}</div>
                            <p className="psi-card-description">{metric.audit.description}</p>
                        </div>
                    )
                })}
            </div>
        </div>


    );

}
function PanelView(tab) {
    console.log(tab);
    return (
        <Fragment>
            <p>{tab.title}</p>
            <MetricPanel {...tab} />
        </Fragment>
    )
}
function Panels(props) {

    const { id: url, lighthouseResult } = props;
    const { audits, categories } = lighthouseResult;
    const [panels, setPanels] = useState([]);

    const getPanels = () => {
        let newPanels = [];
        for (const key in categories) {
            if (categories.hasOwnProperty(key)) {
                newPanels.push({
                    name: categories[key].id,
                    title: categories[key].title,
                    className: `tab-${categories[key].id}`,
                    data: {
                        auditRefs: categories[key].auditRefs || [],
                        audits: getAudits(categories[key].auditRefs)
                    }
                })
            }
        }

        setPanels([
            ...panels,
            ...newPanels
        ])

    }

    const getAudits = (auditRefs) => {
        return auditRefs.map((auditRef) => {
            return audits[auditRef.id] || null;
        })
    }

    useEffect(() => {
        getPanels();
    }, []);

    console.log( props );
    
    return (
        <TabPanel
            className="psi-tab-panel"
            activeClass="active-tab"
            onSelect={null}
            tabs={panels}
        >
            {(tab) => <PanelView {...tab} />}
        </TabPanel>
    )
}

function PageSpeedInsights() {

    const [data, setData] = useState(null);
    
    useEffect( () => {
        const url = setUpQuery();
        fetch(url)
        .then(response => response.json())
        .then(json => {
            setData(json)
        });
    },[]);
    
    if (data == null) {
        return <h3>Loading...</h3>;
    }

    return (
        <Fragment>
            <CoreWebVitals {...data} />
            <Panels {...data} />
        </Fragment>
    );
}

window.addEventListener(
    'load',
    function () {
        render(
            <PageSpeedInsights />,
            document.querySelector('#bca-psi-root')
        );
    },
    false
);