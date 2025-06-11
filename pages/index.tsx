import { useState, useEffect } from 'react';
import sanitizeText from '../utils/sanitizeText';
import formatToDDMMYY from '../utils/formatToDDMMYY';

export default function Home() {
  // Inputs
  const [platform, setPlatform] = useState('');
  const [university, setUniversity] = useState('');
  const [program, setProgram] = useState('');
  const [campType, setCampType] = useState('');
  const [campTheme, setCampTheme] = useState('');
  const [campDate, setCampDate] = useState('');

  // Outputs
  const [campaignName, setCampaignName] = useState('na_na_na');
  const [adSetName, setAdSetName] = useState('na');
  const [adName, setAdName] = useState('na');
  const [utmString, setUtmString] = useState('');
  const [finalUrl, setFinalUrl] = useState('');

  // Generate names in real-time
  useEffect(() => {
    // sanitize & segments
    const seg = (val: string) => 
      (sanitizeText(val) || 'na').replace(/\s+/g,'+');
    const uni = seg(university), prog = seg(program);
    const type = campType || 'na';
    const theme = campTheme ? seg(campTheme) : 'na';
    const date = campDate ? formatToDDMMYY(campDate) : 'na';

    setCampaignName(`${uni}_${prog}_${type}_${theme}`);
    setAdSetName(`${uni}_${prog}_${type}_${theme}`); // extend with adset logic
    setAdName(`${uni}_${prog}_${type}_${theme}`);   // extend with ad logic
  }, [university, program, campType, campTheme, campDate]);

  // UTM Generation
  function generateUTM() {
    if (!platform) { return alert('Please choose Platform'); }
    let utm = '';
    switch(platform) {
      case 'Facebook':
        utm = `utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_adset={{adset.name}}&utm_ad={{ad.name}}&cid={{campaign.id}}&asid={{adset.id}}&aid={{ad.id}}&fsource={{site_source_name}}&placement={{placement}}`;
        break;
      // add other templates here...
    }
    setUtmString(utm);
  }

  // Final URL
  function generateURL() {
    // assume utmString set
    const base = document.getElementById('landing-page') as HTMLInputElement;
    if (!base?.value) { return alert('Please enter Landing Page URL'); }
    const sep = base.value.includes('?') ? '&' : '?';
    setFinalUrl(`${base.value}${sep}${utmString}`);
  }

  // Render
  return (
    <div className="container mx-auto p-6 grid grid-cols-2 gap-8">
      {/* Left column: inputs */}
      <div>
        <h2>Campaign Name</h2>
        {/* Platform, University, Program, etc. */}
      </div>
      {/* Right column: outputs */}
      <div>
        <h2>Final Result</h2>
        <div>{campaignName} <button>📋</button></div>
        <div>{adSetName} <button>📋</button></div>
        <div>{adName} <button>📋</button></div>

        <h2>UTM Generator</h2>
        <button onClick={generateUTM}>Generate</button>
        <div>{utmString} <button>📋</button></div>

        <h2>Final URL</h2>
        <input id="landing-page" placeholder="https://www.cnn.com/" />
        <button onClick={generateURL}>Generate</button>
        <div>{finalUrl} <button>📋</button></div>
      </div>
    </div>
  );
}
