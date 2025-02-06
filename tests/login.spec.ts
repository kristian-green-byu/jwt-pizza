import {test, expect} from 'playwright-test-coverage';

test('home page', async ({page}) => {
  await page.goto('/');

  await expect(page.getByRole('list')).toContainText('home');
  await expect(page.getByRole('main')).toContainText('Pizza is an absolute delight that brings joy to people of all ages. The perfect combination of crispy crust, savory sauce, and gooey cheese makes pizza an irresistible treat. At JWT Pizza, we take pride in serving the web\'s best pizza, crafted with love and passion. Our skilled chefs use only the finest ingredients to create mouthwatering pizzas that will leave you craving for more. Whether you prefer classic flavors or adventurous toppings, our diverse menu has something for everyone. So why wait? Indulge in the pizza experience of a lifetime and visit JWT Pizza today!');
  await expect(page.getByRole('contentinfo')).toContainText('FranchiseAboutHistory');
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Franchise' })).toBeVisible();

  await page.getByRole('contentinfo').getByRole('link', { name: 'Franchise' }).click();
  await page.getByRole('link', { name: 'home' }).click();
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Order now' }).click();
  await expect(page.getByText('Awesome is a click away')).toBeVisible();
});