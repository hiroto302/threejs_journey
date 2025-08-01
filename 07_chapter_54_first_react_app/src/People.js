import { useState, useEffect } from "react"

export default function People()
{

  const [people, setPeople] = useState([
    { name: "John" },
    { name: "Jane"},
    { name: "Bob"},
    { name: "Charlie"},
  ])

  // NOTE: Fetching data from an API (上記を使用せずにAPIからデータを取得する例)
  // 以下は無料のフェイクREST API. API学習用：実際のサーバーを用意せずにHTTPリクエストの練習が可能
  // https://jsonplaceholder.typicode.com/
  // https://jsonplaceholder.typicode.com/users

  const getPeople0 = () => {
    const url = 'https://jsonplaceholder.typicode.com/users';
    /* fetchはブラウザ標準のHTTPクライアントです：
        非同期通信：ページをリロードせずにサーバーとデータをやり取り
        Promise ベース：非同期処理を扱いやすくする仕組み
        軽量：XMLHttpRequestより使いやすい現代的な方法 */
    const request = fetch(url);

    console.log(request); // Promise オブジェクトが表示
    /* Promiseは「将来完了する処理の約束」
      1. pending（待機中）: まだ結果が分からない
      2. fulfilled（成功）: 処理が成功した
      3. rejected（失敗）: 処理が失敗した

        fetchは非同期処理を行うため、すぐに結果が得られない
        Promiseは非同期処理の結果を扱うためのオブジェクト
        thenメソッドを使って、非同期処理が完了したときの処理を定義できる
    */

    // then: Promiseが成功したときに実行される関数を登録
    request.then((response) => {
      console.log(response);
      console.log(response.status); //200 OK
      console.log('Content-Type:', response.headers.get('content-type'));
      // → "application/json; charset=utf-8"
      // レスポンスのステータスコードやヘッダー情報を確認できる。JSONデータを取得可能であることが分かる

      const json = response.json(); // レスポンスをJSON形式に変換するメソッド(これもPromiseを返す)
      json.then((data) => {
        console.log(data);
      })
    })
  }

  // getPeople0 を簡潔に記述
  const getPeople1 = () => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => {
        setPeople(data);
      })
      .catch(error => console.error('Error fetching people:', error));
  }

  // getPeople1 を非同期処理で記述
  // async/awaitを使うと、非同期処理を同期的に書ける
  // async関数内でawaitを使うと、Promiseの結果を待つ
  // また、エラーが発生しても、try/catchで簡単に処理できる
  // さらに、main process をblockすることなく、非同期処理を行うことができる
  const getPeople = async () => {
    try {
      console.log('Start Fetching people...');
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      console.log('response success:', response.ok); // true
      const result = await response.json();
      console.log('result:', result);
      await sleep(3000); // 2秒待機
      setPeople(result);
    }
    catch (error) {
      console.error('Error fetching people:', error);
    }
  }

  // NOTE: sleep関数は指定した時間だけ待機するための関数
  // Promiseを返すので、awaitで待機可能。
  // 成功時にresolveを呼び出し、指定した時間後に解決される
  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  useEffect(() => {
    getPeople();
  }, []);

  return <div>
      <h2>People</h2>
      <ul>
        {
          people.map((person, index) => {
            return <li key={index}>{ person.name }</li>
          })
        }
      </ul>
    </div>
}