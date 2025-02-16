import { test, expect } from 'playwright-test-coverage';

test('franchise dashboard displays', async ({ page }) => {
    await page.goto('/franchise-dashboard');
    await expect(page.getByText('So you want a piece of the')).toBeVisible();
    await expect(page.getByText('If you are already a')).toBeVisible();
    await expect(page.getByText('Call now800-555-')).toBeVisible();
    await expect(page.getByText('Now is the time to get in on')).toBeVisible();
    await expect(page.locator('thead')).toMatchAriaSnapshot(`- columnheader "Franchise Fee"`);
    await expect(page.getByText('Are you ready to embark on a')).toBeVisible();
});

test('franchise dashboard works for franchisee', async ({ page }) => {
    await page.route('*/**/api/auth', async (route) => {
        const loginReq = {
            email: "f@jwt.com",
            password: "test"
        };
        const loginRes = {
            user: {
                id: 1,
                name: "pizza franchisee",
                email: "f@jwt.com",
                roles: [
                    {
                        objectId: 1,
                        role: "franchisee"
                    }
                ]
            },
            token: "test123"
        };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
    });
    await page.route('*/**/api/franchise/1', async (route) => {
        const franchiseRes = [
            {
                id: 1,
                name: "Franchise",
                admins: [
                    {
                        id: 1,
                        name: "pizza franchisee",
                        email: "f@jwt.com"
                    }
                ],
                stores: [
                    {
                        id: 1,
                        name: "The Moon",
                        totalRevenue: 9000.1
                    }
                ]
            }
        ];
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: franchiseRes });
    });
    await page.goto('/login');
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('f@jwt.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('test');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();

    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await expect(page.getByRole('heading', { name: 'Franchise' }).locator('span')).toBeVisible();
    await expect(page.getByText('Everything you need to run an')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible(); await expect(page.getByRole('button', { name: 'Create store' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'The Moon' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '₿' })).toBeVisible();
});

test('Admin dashboard displays normally for admin', async ({ page }) => {
    await page.route('*/**/api/auth', async (route) => {
        const loginReq = {
            email: "test@jwt.com",
            password: "test"
        };
        const loginRes = {
            user: {
                id: 1,
                name: "tester",
                email: "test@jwt.com",
                roles: [
                    {
                        role: "admin"
                    }
                ]
            },
            token: "test123"
        };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
    });
    await page.goto('/login');
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('test@jwt.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('test');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByText('Mama Ricci\'s kitchen')).toBeVisible();
    await expect(page.getByText('Keep the dough rolling and')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Franchise', exact: true })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Franchisee' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Store' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Revenue' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Action' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Franchise' })).toBeVisible();

});

test('Create and close franchise works normally', async ({ page }) => {
    await page.route('*/**/api/auth', async (route) => {
        const loginReq = {
            email: "test@jwt.com",
            password: "test"
        };
        const loginRes = {
            user: {
                id: 1,
                name: "tester",
                email: "test@jwt.com",
                roles: [
                    {
                        role: "admin"
                    }
                ]
            },
            token: "test123"
        };
        if (route.request().method() == 'PUT') {
            expect(route.request().postDataJSON()).toMatchObject(loginReq);
            await route.fulfill({ json: loginRes });
        }
    });
    await page.route('*/**/api/franchise', async (route) => {
        const req = {
            stores: [],
            id: "",
            name: "testFranchise",
            admins: [
                {
                    email: "f@jwt.com"
                }
            ]
        }
        const getRes = [
            {
                id: 1,
                name: "Franchise",
                admins: [
                    {
                        id: 1,
                        name: "Admin",
                        email: "test@admin.com"
                    }
                ],
                stores: []
            },
            {
                id: 2,
                name: "testFranchise",
                admins: [
                    {
                        email: "f@jwt.com",
                        id: 3,
                        name: "pizza franchisee"
                    }
                ],
                stores: []
            }
        ];
        const res = {
            stores: [],
            id: 2,
            name: "testFranchise",
            admins: [
                {
                    email: "f@jwt.com",
                    id: 3,
                    name: "pizza franchisee"
                }
            ]
        };
        if (route.request().method() == 'POST') {
            expect(route.request().postDataJSON()).toMatchObject(req);
            await route.fulfill({ json: res });
        }
        else {
            await route.fulfill({ json: getRes });
        }
    });
    await page.route('*/**/api/franchise/2', async (route) => {
        const res = {
            "message": "franchise deleted"
        };
        if (route.request().method() == 'DELETE') {
            await route.fulfill({ json: res });
        }
    });
    await page.goto('/login');
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('test@jwt.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('test');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByRole('button', { name: 'Add Franchise' }).click();
    await expect(page.getByText('Want to create franchise?')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'franchise name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'franchisee admin email' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await page.getByPlaceholder('franchise name').click();
    await page.getByPlaceholder('franchise name').fill('testFranchise');
    await page.getByPlaceholder('franchisee admin email').click();
    await page.getByPlaceholder('franchisee admin email').fill('f@jwt.com');
    await page.getByRole('button', { name: 'Create' }).click();

    await page.getByRole('row', { name: 'testFranchise pizza' }).getByRole('button').click();
    await expect(page.getByText('Sorry to see you go')).toBeVisible();
    await expect(page.getByText('Are you sure you want to')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByText('Mama Ricci\'s kitchen')).toBeVisible();
});

test('Create and close store works normally', async ({ page }) => {
    await page.route('*/**/api/auth', async (route) => {
        const loginReq = {
            email: "test@jwt.com",
            password: "test"
        };
        const loginRes = {
            user: {
                id: 1,
                name: "tester",
                email: "test@jwt.com",
                roles: [
                    {
                        role: "franchisee"
                    }
                ]
            },
            token: "test123"
        };
        if (route.request().method() == 'PUT') {
            expect(route.request().postDataJSON()).toMatchObject(loginReq);
            await route.fulfill({ json: loginRes });
        }
    });

    await page.route('*/**/api/franchise/1', async (route) => {
        const getRes = [
            {
                id: 1,
                name: "Test Pizza Franchise",
                admins: [
                    {
                        id: 1,
                        name: "pizza franchisee",
                        email: "f@jwt.com"
                    }
                ],
                stores: [
                    {
                        id: 1,
                        name: "The Moon",
                        totalRevenue: 99.3
                    },
                    {
                        id: 2,
                        name: "test store",
                        totalRevenue: 0
                    }
                ]
            }
        ];
        if (route.request().method() == 'GET') {
            await route.fulfill({ json: getRes });
        }
    });

    await page.route('*/**/api/franchise/1/store', async (route) => {
        const postReq = {
            id: "",
            name: "test store"
        };

        const postRes = {
            id: 2,
            franchiseId: 1,
            name: "test store"
        };

        if (route.request().method() == 'POST') {
            expect(route.request().postDataJSON()).toMatchObject(postReq);
            await route.fulfill({ json: postRes });
        }
    });

    await page.route('*/**/api/franchise/1/store/2', async (route) => {
        const deleteRes = {
            message: "store deleted"
        };

        if (route.request().method() == 'DELETE') {
            await route.fulfill({ json: deleteRes });
        }
    });

    await page.goto('/login');
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('test@jwt.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('test');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await page.getByRole('button', { name: 'Create store' }).click();
    await page.getByPlaceholder('store name').click();
    await page.getByPlaceholder('store name').fill('test store');
    await expect(page.getByText('Create store')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByRole('cell', { name: 'test store' })).toBeVisible();
    await expect(page.getByRole('row', { name: 'test store 0 ₿ Close' }).getByRole('button')).toBeVisible();
    await page.getByRole('row', { name: 'test store 0 ₿ Close' }).getByRole('button').click();
    await expect(page.getByText('Sorry to see you go')).toBeVisible();
    await expect(page.getByText('Are you sure you want to')).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByText('Test Pizza Franchise')).toBeVisible();
});