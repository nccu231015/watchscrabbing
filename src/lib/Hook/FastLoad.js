export const FastLoad = async(page) =>{
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (['image', 'font'].includes(request.resourceType())) {
            request.abort();
        } else {
            request.continue();
        }
    });
}