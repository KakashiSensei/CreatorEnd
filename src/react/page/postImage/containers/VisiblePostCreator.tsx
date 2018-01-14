import PostCreator from "../components/PostCreator";
import { connect } from 'react-redux';
import PostActions from '../actions';


const mapStateToProps = state => {
    return {
        postReducer: state.postReducer
    }
}

const VisiblePostCreator = connect(
    mapStateToProps
)(PostCreator)

export default VisiblePostCreator;