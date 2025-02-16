import { test, expect } from 'playwright-test-coverage';

test('login works as intended', async ({ page }) => {
    await page.route('*/**/api/auth', async (route) => {
        const loginReq = {
            email: "t@jwt.com",
            password: "test"
        };
        const loginRes = {
            user: {
                id: 1337,
                name: "Tester",
                email: "t@jwt.com",
                roles: [
                    {
                        role: "diner"
                    }
                ]
            },
            token: "token123"
        };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
    });

    await page.goto('/login');
    await expect(page.getByText('Welcome back')).toBeVisible();
    await expect(page.getByText('Email addressPasswordLoginAre')).toBeVisible();
    await expect(page.getByText('FranchiseAboutHistory')).toBeVisible();
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('t@jwt.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('test');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();

});

test('login error works as intended', async ({ page }) => {
    await page.route('*/**/api/auth', async (route) => {
        const loginReq = {
            email: "wrongemail@email.com",
            password: "badpassword"
        };
        const loginRes = {
            code: 404,
            message: "User not found"
        };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);

        await route.fulfill({ status: 404, json: loginRes });
    });

    await page.goto('/login');

    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('wrongemail@email.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('badpassword');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('{"code":404,"message":"User not found"}')).toBeVisible();
});

test('logout works as intended', async ({ page }) => {
    await page.route('*/**/api/auth', async (route) => {
        const loginReq = {
            email: "t@jwt.com",
            password: "test"
        };
        const loginRes = {
            user: {
                id: 1337,
                name: "Tester",
                email: "t@jwt.com",
                roles: [
                    {
                        role: "diner"
                    }
                ]
            },
            token: "token123"
        };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
    });
    await page.goto('/login');


    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('t@jwt.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('test');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.route('*/**/api/auth', async (route) => {
        const logoutRes = {
            "message": "logout successful"
        };
        if(route.request().method() == 'DELETE'){
            await route.fulfill({ json: logoutRes });
        }
    });
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
});

test('normal registration', async ({ page }) => {
    await page.route('*/**/api/auth', async (route) => {
        const registerReq = {
            name: "test",
            email: "testuser123@email.com",
            password: "testpass"
        };
        const registerRes = {
            user: {
              name: "test",
              email: "testuser123@email.com",
              roles: [
                {
                  role: "diner"
                }
              ],
              id: 2114
            },
            token: "test123"
          };
        expect(route.request().method()).toBe('POST');
        expect(route.request().postDataJSON()).toMatchObject(registerReq);
        await route.fulfill({ json: registerRes });
    });
    await page.goto('/register');
    await expect(page.getByText('Welcome to the party')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Full name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
    await expect(page.getByText('Already have an account?')).toBeVisible();
    await page.getByPlaceholder('Full name').click();
    await page.getByPlaceholder('Full name').fill('test');
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('testuser123@email.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('testpass');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
});

test('dinerDashboard displays normally user', async ({ page }) => {
    await page.route('*/**/api/auth', async (route) => {
        const loginReq = {
            email: "t@jwt.com",
            password: "test"
        };
        const loginRes = {
            user: {
                id: 1337,
                name: "Tester",
                email: "t@jwt.com",
                roles: [
                    {
                        role: "diner"
                    }
                ]
            },
            token: "token123"
        };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
    });
    await page.goto('/login');
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('t@jwt.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('test');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'T', exact: true }).click();
    await expect(page.getByText('Your pizza kitchen')).toBeVisible();
    await expect(page.getByRole('img', { name: 'Employee stock photo' })).toBeVisible();
    await expect(page.getByText('name:')).toBeVisible();
    await expect(page.getByText('email:')).toBeVisible();
    await expect(page.getByText('role:')).toBeVisible();
    await expect(page.getByText('How have you lived this long')).toBeVisible();

});

test('dinerDashboard displays normally franchisee', async ({ page }) => {
    await page.route('*/**/api/auth', async (route) => {
        const loginReq = {
            email: "t@jwt.com",
            password: "test"
        };
        const loginRes = {
            user: {
                id: 1337,
                name: "Tester",
                email: "t@jwt.com",
                roles: [
                    {
                        role: "franchisee"
                    }
                ]
            },
            token: "token123"
        };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
    });
    await page.goto('/login');
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('t@jwt.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('test');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'T', exact: true }).click();
    await expect(page.getByText('Your pizza kitchen')).toBeVisible();
    await expect(page.getByRole('img', { name: 'Employee stock photo' })).toBeVisible();
    await expect(page.getByText('name:')).toBeVisible();
    await expect(page.getByText('email:')).toBeVisible();
    await expect(page.getByText('role:')).toBeVisible();
    await page.getByText('Franchisee on').click();
    await expect(page.getByText('How have you lived this long')).toBeVisible();

});