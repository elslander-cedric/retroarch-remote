import { RetroarchRemotePage } from './app.po';

describe('retroarch-remote App', function() {
  let page: RetroarchRemotePage;

  beforeEach(() => {
    page = new RetroarchRemotePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
