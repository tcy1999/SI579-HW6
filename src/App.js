import 'bootstrap/dist/css/bootstrap.min.css';
import { useRef, useState } from 'react';
import { addS, groupBy } from './utils';
import OutputItem from './outputItem';

function App() {
  const inputEl = useRef(null);
  const [description, setDescription] = useState('');
  const [saved, setSaved] = useState([]);
  const [output, setOutput] = useState('');

  function saveWords(word){
    setSaved(oldSaved => oldSaved.concat(word));
  }

  async function fetchList(target='rhyme'){
    let fetchUrl = 'https://api.datamuse.com/words?rel_rhy=' + inputEl.current.value;

    if(target === 'rhyme'){
      setDescription(`Words that rhyme with ${inputEl.current.value}`);
    } else {
      setDescription(`Words with a similar meaning to ${inputEl.current.value}`);
      fetchUrl = 'https://api.datamuse.com/words?ml=' + inputEl.current.value;
    }
    setOutput(<span>loading...</span>);

    const response = await fetch(fetchUrl);
    const result = await response.json();

    setOutput('');
    if(result.length){
      if(target === 'rhyme'){
        const groupbyResult = groupBy(result, 'numSyllables');
        const groupbyOut = []
        for(const key in groupbyResult){
            groupbyOut.push(<h3 key={key}>{`${key} syllable${addS(parseInt(key))}:`}</h3>);
            groupbyOut.push(groupbyResult[key].map((item, i) => <OutputItem onSave={() => saveWords(item.word)} 
            key={i} word={item.word} /> ))
        }
        setOutput(groupbyOut);
      } else {
        setOutput(result.map((item, i) => <OutputItem onSave={() => saveWords(item.word)} 
        key={i} word={item.word} /> ));
      }
    } else {
      setOutput(<span>(no result)</span>);
    }
  }

  function onKeydown(event) {
    if(event.key === 'Enter') {
        fetchList();
    }
  }

  return (
    <div>
      <main className="container">
        <h1 className="row">React Rhyme Finder (579 Problem Set 6)</h1>
        <div className="row">
            <div className="col"><a href='https://github.com/tcy1999/SI579-HW6/tree/main'>Source code</a></div>
        </div>
        <div className="row">
            <div className="col">Saved words: <span>{saved.length ? saved.join(', ') : '(none)'}</span></div>
        </div>
        <div className="row">
            <div className="input-group col">
                <input className="form-control" type="text" placeholder="Enter a word" onKeyDown={onKeydown} 
                ref={inputEl}/>
                <button type="button" className="btn btn-primary" 
                onClick={() => fetchList()}>Show rhyming words</button>
                <button type="button" className="btn btn-secondary" 
                onClick={() => fetchList('synonym')}>Show synonyms</button>
            </div>
        </div>
        <div className="row">
            <h2 className="col">{description}</h2>
        </div>
        <div className="output row">
            <output className="col">{output}</output>
        </div>
    </main>
    </div>
  );
}

export default App;
