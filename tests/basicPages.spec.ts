import {test, expect} from 'playwright-test-coverage';

test('home page displays normally', async ({page}) => {
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

test('about page displays normally', async ({page}) => {
  await page.goto('/about');
  await expect(page.getByText('The secret sauce')).toBeVisible();
  await expect(page.getByText('At JWT Pizza, our amazing')).toBeVisible();
  await expect(page.getByText('FranchiseAboutHistory')).toBeVisible();
});

test('history page displays normally', async ({page}) => {
  await page.goto('/history');
  await expect(page.getByText('Mama Rucci, my my')).toBeVisible();
  await expect(page.getByText('It all started in Mama Ricci\'')).toBeVisible();
  await expect(page.getByRole('main').getByRole('img')).toBeVisible();
  await expect(page.getByText('FranchiseAboutHistory')).toBeVisible();
});

test('notFound works as intended', async ({page}) => {
  await page.goto('/badlink');
  await expect(page.getByText('Oops')).toBeVisible();
  await expect(page.getByRole('link', { name: 'badlink' })).toBeVisible();
  await expect(page.getByText('It looks like we have dropped')).toBeVisible();
});

test('Docs works as intended', async ({page}) => {
  await page.route('*/**/api/docs', async (route) => {
    const apiConfig = {
      version: "20240518.154317",
      endpoints: [
        {
          method: "POST",
          path: "/api/auth",
          description: "Register a new user",
          example: "curl -X POST localhost:3000/api/auth -d '{\"name\":\"pizza diner\", \"email\":\"d@jwt.com\", \"password\":\"diner\"}' -H 'Content-Type: application/json'",
          response: {
            user: {
              id: 2,
              name: "pizza diner",
              email: "d@jwt.com",
              roles: [
                {
                  role: "diner"
                }
              ]
            },
            token: "tttttt"
          }
        },
        {
          method: "PUT",
          path: "/api/auth",
          description: "Login existing user",
          example: "curl -X PUT localhost:3000/api/auth -d '{\"email\":\"a@jwt.com\", \"password\":\"admin\"}' -H 'Content-Type: application/json'",
          response: {
            user: {
              id: 1,
              name: "常用名字",
              email: "a@jwt.com",
              roles: [
                {
                  role: "admin"
                }
              ]
            },
            token: "tttttt"
          }
        },
        {
          method: "PUT",
          path: "/api/auth/:userId",
          requiresAuth: true,
          description: "Update user",
          example: "curl -X PUT localhost:3000/api/auth/1 -d '{\"email\":\"a@jwt.com\", \"password\":\"admin\"}' -H 'Content-Type: application/json' -H 'Authorization: Bearer tttttt'",
          response: {
            id: 1,
            name: "常用名字",
            email: "a@jwt.com",
            roles: [
              {
                role: "admin"
              }
            ]
          }
        },
        {
          method: "DELETE",
          path: "/api/auth",
          requiresAuth: true,
          description: "Logout a user",
          example: "curl -X DELETE localhost:3000/api/auth -H 'Authorization: Bearer tttttt'",
          response: {
            message: "logout successful"
          }
        },
        {
          method: "GET",
          path: "/api/order/menu",
          description: "Get the pizza menu",
          example: "curl localhost:3000/api/order/menu",
          response: [
            {
              id: 1,
              title: "Veggie",
              image: "pizza1.png",
              price: 0.0038,
              description: "A garden of delight"
            }
          ]
        },
        {
          method: "PUT",
          path: "/api/order/menu",
          requiresAuth: true,
          description: "Add an item to the menu",
          example: "curl -X PUT localhost:3000/api/order/menu -H 'Content-Type: application/json' -d '{ \"title\":\"Student\", \"description\": \"No topping, no sauce, just carbs\", \"image\":\"pizza9.png\", \"price\": 0.0001 }'  -H 'Authorization: Bearer tttttt'",
          response: [
            {
              id: 1,
              title: "Student",
              description: "No topping, no sauce, just carbs",
              image: "pizza9.png",
              price: 0.0001
            }
          ]
        },
        {
          method: "GET",
          path: "/api/order",
          requiresAuth: true,
          description: "Get the orders for the authenticated user",
          example: "curl -X GET localhost:3000/api/order  -H 'Authorization: Bearer tttttt'",
          response: {
            dinerId: 4,
            orders: [
              {
                id: 1,
                franchiseId: 1,
                storeId: 1,
                date: "2024-06-05T05:14:40.000Z",
                items: [
                  {
                    id: 1,
                    menuId: 1,
                    description: "Veggie",
                    price: 0.05
                  }
                ]
              }
            ],
            page: 1
          }
        },
        {
          method: "POST",
          path: "/api/order",
          requiresAuth: true,
          description: "Create a order for the authenticated user",
          example: "curl -X POST localhost:3000/api/order -H 'Content-Type: application/json' -d '{\"franchiseId\": 1, \"storeId\":1, \"items\":[{ \"menuId\": 1, \"description\": \"Veggie\", \"price\": 0.05 }]}'  -H 'Authorization: Bearer tttttt'",
          response: {
            order: {
              franchiseId: 1,
              storeId: 1,
              items: [
                {
                  menuId: 1,
                  description: "Veggie",
                  price: 0.05
                }
              ],
              id: 1
            },
            jwt: "1111111111"
          }
        },
        {
          method: "GET",
          path: "/api/franchise",
          description: "List all the franchises",
          example: "curl localhost:3000/api/franchise",
          response: [
            {
              id: 1,
              name: "pizzaPocket",
              admins: [
                {
                  id: 4,
                  name: "pizza franchisee",
                  email: "f@jwt.com"
                }
              ],
              stores: [
                {
                  id: 1,
                  name: "SLC",
                  totalRevenue: 0
                }
              ]
            }
          ]
        },
        {
          method: "GET",
          path: "/api/franchise/:userId",
          requiresAuth: true,
          description: "List a user's franchises",
          example: "curl localhost:3000/api/franchise/4  -H 'Authorization: Bearer tttttt'",
          response: [
            {
              id: 2,
              name: "pizzaPocket",
              admins: [
                {
                  id: 4,
                  name: "pizza franchisee",
                  email: "f@jwt.com"
                }
              ],
              stores: [
                {
                  id: 4,
                  name: "SLC",
                  totalRevenue: 0
                }
              ]
            }
          ]
        },
        {
          method: "POST",
          path: "/api/franchise",
          requiresAuth: true,
          description: "Create a new franchise",
          example: "curl -X POST localhost:3000/api/franchise -H 'Content-Type: application/json' -H 'Authorization: Bearer tttttt' -d '{\"name\": \"pizzaPocket\", \"admins\": [{\"email\": \"f@jwt.com\"}]}'",
          response: {
            name: "pizzaPocket",
            admins: [
              {
                email: "f@jwt.com",
                id: 4,
                name: "pizza franchisee"
              }
            ],
            id: 1
          }
        },
        {
          method: "DELETE",
          path: "/api/franchise/:franchiseId",
          requiresAuth: true,
          description: "Delete a franchise",
          example: "curl -X DELETE localhost:3000/api/franchise/1 -H 'Authorization: Bearer tttttt'",
          response: {
            message: "franchise deleted"
          }
        },
        {
          method: "POST",
          path: "/api/franchise/:franchiseId/store",
          requiresAuth: true,
          description: "Create a new franchise store",
          example: "curl -X POST localhost:3000/api/franchise/1/store -H 'Content-Type: application/json' -d '{\"franchiseId\": 1, \"name\":\"SLC\"}' -H 'Authorization: Bearer tttttt'",
          response: {
            id: 1,
            name: "SLC",
            totalRevenue: 0
          }
        },
        {
          method: "DELETE",
          path: "/api/franchise/:franchiseId/store/:storeId",
          requiresAuth: true,
          description: "Delete a store",
          example: "curl -X DELETE localhost:3000/api/franchise/1/store/1  -H 'Authorization: Bearer tttttt'",
          response: {
            message: "store deleted"
          }
        }
      ],
      config: {
        factory: "https://pizza-factory.cs329.click",
        db: "127.0.0.1"
      }
    };
    
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: apiConfig });
});
  await page.goto('/docs');
  await expect(page.getByText('JWT Pizza API')).toBeVisible();
  await expect(page.getByRole('heading', { name: '[POST] /api/auth' })).toBeVisible();
  await expect(page.getByText('curl -X POST localhost:3000/api/auth -d \'{"name":"pizza diner", "email":"d@jwt.')).toBeVisible();
  await expect(page.getByText('{ "user": { "id": 2, "name')).toBeVisible();
  await expect(page.getByRole('heading', { name: '🔐 [DELETE] /api/franchise/:franchiseId/store/:storeId' })).toBeVisible();
  await expect(page.getByText('Delete a store')).toBeVisible();
  await expect(page.getByText('Example requestcurl -X DELETE localhost:3000/api/franchise/1/store/1 -H \'')).toBeVisible();
  await expect(page.getByText('Response{ "message": "store')).toBeVisible();
  
});

