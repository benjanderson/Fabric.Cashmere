import {AppPage} from './app.po';

describe('workspace-project App', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should have get started button', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('Get Started');
    });
});
