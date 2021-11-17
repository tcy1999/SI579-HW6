export default function OutputItem(props){
    return (<li>{props.word} <button type='button' 
    className='btn btn-outline-success' onClick={props.onSave}>(save)</button></li>)
}
