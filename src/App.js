import React, { useEffect, useRef, useState } from 'react';
import './App.css'
import { DATA } from './DATA';
const WORD_LIST_API_URL = 'https://api.frontendexpert.io/api/fe/wordle-words';

export default function Wordle() {
  // Write your code here.
  const MAXI=6;
  const MAXJ=5
  const [words, setWords] = useState(DATA);
  const [solution, setSolution] = useState(DATA[parseInt(Math.random()*DATA.length)]);
  const [rows,setRows]=useState(Array(MAXI).fill(1).map(()=>Array(MAXJ).fill(1).map(()=>({value:'',className:''}))))
  const [i,setI]=useState(0);
  const [j,setJ]=useState(0);
  const [gamesEnded,setGamesEnded]=useState(false)
  const callbackRef=useRef()
 
  useEffect(()=>{
    callbackRef.current=(e)=>{
      if(gamesEnded)return
      const arr=[...rows.map(r=>[...r])];
      const regex=/^[a-zA-Z]$/;
      if(regex.test(e.key)) {
        if(j<MAXJ){
          // console.log('arr',arr)
          arr[i][j].value=e.key;
          setRows(arr)
          setJ(j+1);
        }
      }
      else if(e.key=='Enter'){
        var finished=true;
        if(j==MAXJ){
         
          arr[i]=arr[i].map((item,index)=>{
            const {value}=item;
            if(value.toLocaleLowerCase()==solution[index].toLocaleLowerCase()) return {value,className:'correct'}
            else if(solution.toLowerCase().includes(value.toLocaleLowerCase())){
              finished=false;
              return {value,className:'close'}}
            else{
              finished=false
              return {value,className:'incorrect'}
            } 
          })
          if(finished)setGamesEnded(true)
          setRows(arr)
          if(i<MAXI-1){
            setI(i+1);
            setJ(0)
          }else{
            setGamesEnded(true)
          }
        }

      }else if(e.key=='Backspace'){
        if(j>0){
          arr[i][j-1].value=''
          setRows(arr);
          setJ(j-1)
        }
      }
    }
  },[i,j,rows,gamesEnded])

  function callback(event){
    callbackRef.current(event)
  }
  useEffect(()=>{
    window.addEventListener('keydown',callback)
    return ()=>window.removeEventListener('keydown',callback)
  },[])

  return (
   
    <div className="board">
      {rows.map((r,indexRow)=><div className='line' key={'row'+indexRow}>
        {r.map((item,indexTile)=><div className={`tile ${item.className}`} key={'tile'+indexRow+":"+indexTile}>{item.value}</div>)}
      </div>)}
    </div>
  );
}