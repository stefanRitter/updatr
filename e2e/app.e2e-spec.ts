import { UpdatrPage } from './app.po';

describe('updatr App', function() {
  let page: UpdatrPage;

  beforeEach(() => {
    page = new UpdatrPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
