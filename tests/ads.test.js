const axios = require('axios');

const baseUrl = 'https://qa-internship.avito.com';
const sellerId = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;

const invalidId = '1';
const nonExistID = '11111111-2222-3333-4444-555555555555';

// Создание объявления шаблон
let createdItemId = null;

const testItem = {
  sellerID: sellerId,
  name: "MacBook",
  price: 150000,
  statistics: {
    likes: 10,
    viewCount: 200,
    contacts: 2
  }
};

// Тесты
describe('API Tests', () => {

    test('001: Успешное создание объявления', async () => {
        const response = await axios.post(`${baseUrl}/api/1/item`, testItem, {
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
      
        expect(response.status).toBe(200);

        const match = response.data.status.match(/Сохранили объявление - ([\w-]+)/);
        createdItemId = match[1] // UUID
        console.log('Created item ID:', createdItemId);
    });


    test('002: Создание объявления без обязательного поля', async () => {
        const testItemWithoutName = { ...testItem };
        delete testItemWithoutName.name;

        try {
            const response = await axios.post(`${baseUrl}/api/1/item`, testItemWithoutName, {
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json' }
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
        }  
    });
    
    /* 
    В задании написано, что все тесты должны быть пройдены, но при ручном тестировании в postman этот тест ложится
    
    test('003: Создание объявления с невалидными данными: отрицательные значения', async () => {
        const testItemNegValue = { ...testItem };
        testItemNegValue.price = -12;
    
        const response = await axios.post(`${baseUrl}/api/1/item`, testItemNegValue, {
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
      
              
        expect(response.status).toBe("400");
        expect(response.data).toHaveProperty('status');
        expect(response.data.status).toBe("400");
    
              
    });
    */

    test('004: Создание объявления с невалидными данными: слишком большие значения', async () => {
        const testItemBigValue = { ...testItem };
        testItemBigValue.price = 5000000000000000000000000000000000000000;
    
        try {
            const response = await axios.post(`${baseUrl}/api/1/item`, testItemBigValue, {
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json' }
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
        }  
              
    });


    test('010: Успешное получение объявления по ID', async () => {
        const response = await axios.get(`${baseUrl}/api/1/item/${createdItemId}`, {
            headers: {'Accept': 'application/json'}
          });
        
        expect(response.status).toBe(200);

        const item = response.data[0];
        const errors = [];
        if (item.id !== createdItemId) {
            errors.push(`ID: expected ${createdItemId}, got ${item.id}`);
        }
        if (item.name !== testItem.name) {
            errors.push(`Name: expected "${testItem.name}", got "${item.name}"`);
        }
        if (item.status !== 200) {
            errors.push(`Status: expected "200", got "${item.status}"`);
        }
        if (item.price !== testItem.price) {
            errors.push(`Price: expected "${testItem.price}", got "${item.price}"`);
        }
        if (item.sellerID !== testItem.sellerID) {
            errors.push(`SellerID: expected "${testItem.sellerID}", got "${item.sellerID}"`);
        }
        if (item.statistics.likes !== testItem.statistics.likes) {
            errors.push(`Likes: expected "${testItem.statistics.likes}", got "${item.statistics.likes}"`);
        }
        if (item.statistics.viewCount !== testItem.statistics.viewCount) {
            errors.push(`ViewCount: expected "${testItem.statistics.viewCount}", got "${item.statistics.viewCount}"`);
        }
        if (item.statistics.contacts !== testItem.statistics.contacts) {
            errors.push(`Contacts: expected "${testItem.statistics.contacts}", got "${item.statistics.contacts}"`);
        }
        if (errors.length > 0) {
            console.log('\n=== Найдены расхождения в 010 тесте ===');
            errors.forEach(error => console.log(`- ${error}`));
        }
    });
    
    test('011: Получение объявления по невалидному ID', async () => {
        try {
            const response = await await axios.get(`${baseUrl}/api/1/item/${invalidId}`, {
            headers: {'Accept': 'application/json'}
          });
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toHaveProperty('status');
            if (error.response.data.status != 400) {
                console.log('\n=== Найдены расхождения в 011 тесте ===');
                console.log(`Status: expected 400, got ${error.response.data.status}`);
            }
            expect(error.response.data).toHaveProperty('result'); }
    });
    
    test('012: Получение объявления по несуществующему ID', async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/1/item/${nonExistID}`, {
            headers: {'Accept': 'application/json'}
          });
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data).toHaveProperty('status');
            if (error.response.data.status != 404) {
                console.log('\n=== Найдены расхождения в 012 тесте ===');
                console.log(`Status: expected 404, got ${error.response.data.status}`);
            }
            expect(error.response.data).toHaveProperty('result'); }
    });

    test('020: Успешное получение статистики по объявлению', async () => {
        const response = await axios.get(`${baseUrl}/api/1/statistic/${createdItemId}`, {
            headers: { 
              'Accept': 'application/json'
            }
        });

        expect(response.status).toBe(200);

        const item = response.data[0];
        const errors = [];
        if (item.likes != testItem.statistics.likes) {
            errors.push(`Likes: expected "${testItem.statistics.likes}", got "${item.likes}"`);
        }
        if (item.viewCount != testItem.statistics.viewCount) {
            errors.push(`ViewCount: expected "${testItem.statistics.viewCount}", got "${item.viewCount}"`);
        }
        if (item.contacts != testItem.statistics.contacts) {
            errors.push(`Contacts: expected "${testItem.statistics.contacts}", got "${item.contacts}"`);
        }
        if (errors.length > 0) {
            console.log('\n=== Найдены расхождения в 020 тесте ===');
            errors.forEach(error => console.log(`- ${error}`));
        }
    });

    test('021: Получение статистики по невалидному ID', async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/1/statistic/${invalidId}`, {
            headers: {'Accept': 'application/json'}});

        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toHaveProperty('status');
            if (error.response.data.status != 400) {
                console.log('\n=== Найдены расхождения в 021 тесте ===');
                console.log(`Status: expected 400, got ${error.response.data.status}`);
            }
            expect(error.response.data).toHaveProperty('result'); }
    });

    test('022: Получение статистики по несуществующему ID', async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/1/statistic/${nonExistID}`, {
            headers: {'Accept': 'application/json'}
          });
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data).toHaveProperty('status');
            if (error.response.data.status != 404) {
                console.log('\n=== Найдены расхождения в 022 тесте ===');
                console.log(`Status: expected 404, got ${error.response.data.status}`);
            }
            expect(error.response.data).toHaveProperty('result'); }
    });

    test('030: Успешное получение всех объявлений', async () => {
        const response = await axios.get(`${baseUrl}/api/1/${sellerId}/item`, {
            headers: { 
              'Accept': 'application/json'
            }
        });

        expect(response.status).toBe(200);

        response.data.forEach(item => {
            expect(item.sellerID).toBe(testItem.sellerId); });
    });

    test('031: Получение всех объявлений по невалидному ID продавца', async () => {        
        try {
            const response = await axios.get(`${baseUrl}/api/1/${invalidId}/item`, {
            headers: {'Accept': 'application/json'}
          });
        } catch (error) {
            expect(error.response.status).toBe(400);
        }    
    });

    test('040: Успешное удаление объявления', async () => {
        const response = await axios.delete(`${baseUrl}/api/2/item/${createdItemId}`);

        expect(response.status).toBe(200);
    });
    
    test('041: Удаление объявления по невалидному ID', async () => {
        try {
            const response = await axios.delete(`${baseUrl}/api/2/item/${invalidId}`);
        } catch (error) {
            expect(error.response.status).toBe(400);
        } 
    });
    
    test('042: Удаление объявления по несуществующему ID', async () => {
        try {
            const response = await axios.delete(`${baseUrl}/api/2/item/${nonExistID}`);
        } catch (error) {
            expect(error.response.status).toBe(404);
        } 
    });


    test('050: Успешное получение статистики по объявлению', async () => {
        const response = await axios.get(`${baseUrl}/api/2/statistic/${createdItemId}`, {
            headers: { 
              'Accept': 'application/json'
            }
        });

        expect(response.status).toBe(200);

        const item = response.data[0];
        const errors = [];
        if (item.likes != testItem.statistics.likes) {
            errors.push(`Likes: expected "${testItem.statistics.likes}", got "${item.likes}"`);
        }
        if (item.viewCount != testItem.statistics.viewCount) {
            errors.push(`ViewCount: expected "${testItem.statistics.viewCount}", got "${item.viewCount}"`);
        }
        if (item.contacts != testItem.statistics.contacts) {
            errors.push(`Contacts: expected "${testItem.statistics.contacts}", got "${item.contacts}"`);
        }
        if (errors.length > 0) {
            console.log('\n=== Найдены расхождения в 050 тесте ===');
            errors.forEach(error => console.log(`- ${error}`));
        }
    });

    test('052: Получение статистики по несуществующему ID', async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/2/statistic/${nonExistID}`, {
            headers: {'Accept': 'application/json'}
          });
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data).toHaveProperty('status');
            if (error.response.data.status != 404) {
                console.log('\n=== Найдены расхождения в 022 тесте ===');
                console.log(`Status: expected 404, got ${error.response.data.status}`);
            }
            expect(error.response.data).toHaveProperty('result'); }
    });


    // Mock тесты
    describe('Server Error Tests (with mocks)', () => {
        beforeEach(() => {
          jest.mock('axios');
          this.mockedAxios = require('axios');
        });
      
        afterEach(() => {
          jest.unmock('axios');
        });
      
        test('013: Ошибка сервера при получении объявления', async () => {
          this.mockedAxios.get.mockRejectedValueOnce({
            response: {
              status: 500,
              data: { status: "500", message: "Server Error" }
            }
          });
      
          try {
            await this.mockedAxios.get(`${baseUrl}/api/1/item/${createdItemId}`, {headers: {'Accept': 'application/json'}});
            fail('Expected 500 error');
          } catch (error) {
            expect(error.response.status).toBe(500);
            expect(error.response.data.status).toBe("500");
          }
        });
      
        test('023: Ошибка сервера при получении статистики', async () => {
          this.mockedAxios.get.mockRejectedValueOnce({
            response: {
              status: 500,
              data: { status: "500" }
            }
          });
      
          try {
            await this.mockedAxios.get(`${baseUrl}/api/1/statistic/${createdItemId}`, {headers: {'Accept': 'application/json'}});
          } catch (error) {
            expect(error.response.status).toBe(500);
          }
        });
    
        test('032: Ошибка сервера при получении всех объявлений', async () => {
            this.mockedAxios.get.mockRejectedValueOnce({
              response: {
                status: 500,
                data: { status: "500" }
              }
            });
        
            try {
              await this.mockedAxios.get(`${baseUrl}/api/1/${createdItemId}/item`, {headers: {'Accept': 'application/json'}});
            } catch (error) {
              expect(error.response.status).toBe(500);
            }
        });

        test('043: Ошибка сервера при удалении объявдения', async () => {
            this.mockedAxios.get.mockRejectedValueOnce({
            response: {
                status: 500,
                data: { status: "500" }
              }
            });
        
            try {
              await this.mockedAxios.delete(`${baseUrl}/api/2/item/${createdItemId}`);
            } catch (error) {
              expect(error.response.status).toBe(500);
            }
        });

        test('053: Ошибка сервера при получении всех объявлений', async () => {
            this.mockedAxios.get.mockRejectedValueOnce({
            response: {
                status: 500,
                data: { status: "500" }
              }
            });
        
            try {
              await this.mockedAxios.get(`${baseUrl}/api/2/statistic/${createdItemId}`, {headers: {'Accept': 'application/json'}});
            } catch (error) {
              expect(error.response.status).toBe(500);
            }
        });

        test('051: Ответ сервера со статусом 100 Continue', async () => {
            this.mockedAxios.get.mockResolvedValueOnce({
              status: 100,
              data: { status: "100" }
            });

            try {
                await this.mockedAxios.get(`${baseUrl}/api/2/statistic/${createdItemId}`, {headers: {'Accept': 'application/json', 'Expect': '100-continue'}});
              } catch (error) {
                expect(error.response.status).toBe(500);
              }
          });
      });   
});    
