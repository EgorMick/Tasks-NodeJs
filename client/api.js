const BASE_URL = 'http://localhost:3000';
const Route = {
    GET_DATA: '/tasks',
};

const Method = {
    GET: 'GET',
    POST: 'POST',
};

const ErrorText = {
    GET_DATA: 'Не удалось загрузить данны. Попробуйте обновить страницу',
    SEND_DATA: 'Не удалось отправить данные для создания новой задачи. Попробуйте ещё раз',
};

const load = (route, errorText, method = Method.GET, body = null) => 
  fetch(`${BASE_URL}${route}`, {method, body})
    .then((response) => { 
      if (!response.ok) { 
        throw new Error();
      }
      return response.json();
    })
    .catch(() => {
      throw new Error(errorText);
    });

const getData = () => load(Route.GET_DATA, ErrorText.GET_DATA);

export {getData};