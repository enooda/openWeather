import { test, expect} from '@playwright/test';
import { assert } from 'console';

test('Get the current weather in Malmö', async ({ page, request }) => {
    await page.goto('https://openweathermap.org/') 

    const cityInput = page.getByPlaceholder('Search city')
    const searchButton = page.locator('.button-round.dark');

    await cityInput.click()
    await cityInput.fill('Malmö')
    await searchButton.click()

    await expect(page.locator('ul.search-dropdown-menu')).toBeVisible()
    await page.locator('ul.search-dropdown-menu li').first().click()

    let webTemperatureText = await page.locator('span.heading').innerText()
    console.log(`The temperature in Malmö is ${webTemperatureText}.`)
    let webTemperature = parseFloat(webTemperatureText.replace("°C", ""));


    const response = await request.get("https://api.openweathermap.org/data/2.5/weather?lat=51.5156177&lon=-0.0919983&units=metric&appid=a1e83cbc639a81965d5cea8d32491e70")
    expect(response.status()).toBe(200)

    const responseBody = await response.json(); 
    const apiTemperature = Math.round(responseBody.main.temp);

    expect(webTemperature).toEqual(apiTemperature);
    
console.log('Temperature on web equals temperature received from API')
  });
  