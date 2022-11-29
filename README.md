
(function (d) {

    const   music_button = '#broadcast-aside-content-brand [aria-label="Interoperate music"]',
            video_button = '#broadcast-aside-content-brand [aria-label="Intro overlay"]',
            wait_screen_button = '#broadcast-aside-content-brand [aria-label="Wait Screen overlay"]',
            go_live = 'div[class*="Header__Right"] [data-testid="dropdown-workaround-id"] button',
            go_live_activate = 'div[class*="GoLiveOverlay"] button:last-child',
            cropped_layout = 'div[class*="Studio__Layout"] button[aria-label*="Thin layout"]',
            solo_host = 'div[class*="Cards__Wrap"] > span[class*="Tooltip__StyledSpan"]:nth-child(1) button[aria-label="Solo layout"]',
            solo_guest = 'div[class*="Cards__Wrap"] > span[class*="Tooltip__StyledSpan"]:nth-child(2) button[aria-label="Solo layout"]',
            mute_host = 'div[class*="Cards__Wrap"] > span[class*="Tooltip__StyledSpan"]:nth-child(1) button[aria-label="Mute mic"]',
            unmute_host = 'div[class*="Cards__Wrap"] > span[class*="Tooltip__StyledSpan"]:nth-child(1) button[aria-label="Unmute mic"]',
            mute_guest = 'div[class*="Cards__Wrap"] > span[class*="Tooltip__StyledSpan"]:nth-child(2) button[aria-label="Mute mic"]',
            unmute_guest = 'div[class*="Cards__Wrap"] > span[class*="Tooltip__StyledSpan"]:nth-child(2) button[aria-label="Unmute mic"]';

    const delay = (delay) => {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    const activate = (path) => {
        console.log('querySelector')
        const element = d.querySelector(path);
        if (element) {
            return element.click()    
        }
    }
            
    const trigger = async (e) => {
        if (e.key == 'F16') {
            console.log('F16 - Solo host');
            activate(solo_host);
        }
        if (e.key == 'F17') {
            console.log('F17 - Solo guest');
            activate(solo_guest);
        }
        if (e.key == 'F18') {
            console.log('F18 - Cropped layout');
            activate(cropped_layout);
        }
        if (e.key == 'F13') {
            console.log('F13 - Go live');
            activate(music_button);
            activate(solo_host);
            activate(wait_screen_button);
            activate(mute_host);
            activate(mute_guest);
            activate(go_live);
            await delay(500);
            activate(go_live_activate);
        }
        if (e.key == 'F14') {
            console.log('F14 - Curtains up');
            activate(wait_screen_button);
            activate(unmute_host);
        }
        if (e.key == 'F15') {
            console.log('F15 - Intro');
            activate(unmute_host);
            activate(unmute_guest);
            activate(music_button);
            activate(video_button);
            await delay(1000);
            activate(cropped_layout);
        }
    }
    
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(addedNode) {
            const className = addedNode.className;
            if (typeof className === 'string') {
                if (addedNode.className.includes('Studio__DesktopWrap')) {
                    d.addEventListener('keydown', trigger, false);
                    observer.disconnect();
                }
            }
        });
      });
    });
    
    observer.observe(d.body, {childList: true, subtree: true});

})(document);