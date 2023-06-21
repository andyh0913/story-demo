"use client";
import useLLM from "usellm";
import { useState } from "react";

export default function Demo() {
  const llm = useLLM({ serviceUrl: "https://usellm.org/api/llm" });
  const [result, setResult] = useState("");
  const [name, setName] = useState("");
  const keywords = [
    "愛情", "夢想", "勇氣", "家庭", "成長", "信仰", "友情", "青春", "自由", "堅強", "榜樣", "幸福", "創造力", "勤奮", "自我實現", "人生價值觀", "才能", "優雅", "自律", "快樂", "孝順", "熱情", "誠實", "感恩", "自信"
  ]
  const styles = ["科幻", "溫馨", "驚悚"]
  const [keywordStatus, setKeywordStatus] = useState(Array(keywords.length).fill(false));
  const [styleStatus, setStyleStatus] = useState(Array(styles.length).fill(false));
  const [prompt, setPrompt] = useState("");

  function Item({word, selected, handleClick}) {
        return (
            <div style={{
                    backgroundColor: selected?'#aaa':'#fff', 
                    display: 'inline-block', 
                    margin: '0.2rem',
                    fontSize: '2rem',
                    border: '1px solid black',
                    borderRadius: '0.2rem'
                }}
                 onClick={handleClick}
            >
                {word}
            </div>
        )
    }

  function handleClickItem(index) {
    const newStatus = keywordStatus.map((s, i) => {
        if (i === index){
            if (s === false && keywordStatus.filter(Boolean).length < 5) return true;
            else return false;
        } else {
            return s;
        }
    })
    setKeywordStatus(newStatus);
  }

  function handleClickStyle(index) {
    const newStatus = styleStatus.map((s, i) => {
        if (i === index){
            return !s;
        } else {
            return s;
        }
    })
    setStyleStatus(newStatus);
  }

  async function handleClick() {
    const selectedKeywords = keywords.filter((word, index) => keywordStatus[index])
    const selectedStyles = styles.filter((word, index) => styleStatus[index])

    let content = prompt || "你是一名經驗豐富的故事作家，我將會給你5個關鍵字和一些故事風格，請用這5個關鍵字的觀念以指定的風格寫出一段小故事，請注意文章長度必須限制在5句話以內。故事的主要主角名稱請用<NAME>替換，其餘角色則不用替換。"
    if (content.slice(-1) !== "。") content = content + "。"
    content = content + "關鍵字：" + selectedKeywords.join("，") + "。故事風格：" + selectedStyles.join("，")
    try {
      await llm.chat({
        messages: [{ role: "user", content: content }],
        stream: true,
        onStream: ({ message }) => setResult(message.content),
      });
      console.log(result.length);
      setResult(result => result.replaceAll("<NAME>", name));
    // const { message } = await llm.chat({
    //     messages: [{ role: "user", content: content }]
    // });
    // setResult(message.content)
    } catch (error) {
      console.error("Something went wrong!", error);
    }
  }

  const keywordDivs = keywords.map((word, index) => <Item word={word} selected={keywordStatus[index]} handleClick={() => handleClickItem(index)}></Item>)
  const styleDivs = styles.map((word, index) => <Item word={word} selected={styleStatus[index]} handleClick={() => handleClickStyle(index)}></Item>)


  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h2>Name</h2>
        <input 
          placeholder="Please enter your name..."
          onChange={(e) => setName(e.target.value)}
        ></input>
        <h2>Prompt</h2>
        <textarea 
          style={{height: "4rem", width: "20rem"}}
          onChange={e => setPrompt(e.target.value)} 
          placeholder="Please enter the prompt. If this area is left blank, a default prompt will be used."></textarea>
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {keywordDivs}
      </div>
      <hr></hr>
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {styleDivs}
      </div>
      <button onClick={handleClick}>Send</button>
      <div style={{ whiteSpace: "pre-wrap" }}>{result}</div>
    </div>
  );
}
