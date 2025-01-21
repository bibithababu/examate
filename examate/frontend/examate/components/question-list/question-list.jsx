'use client'
import {React,useEffect,useState} from 'react';
import './question-list.css';
import { FaSearch,FaFilter } from 'react-icons/fa';
import QuestionFilterModal from './question-filter';
import { ToastContainer, toast } from 'react-toastify';
import CreateQuestion from '../createquestion/createquestion'; 
import { questiontDetail, questiontListing} from '@/services/ApiServices';
import QuestionDetailModal from './question-detail';
import { RiDraftLine } from "react-icons/ri";

import 'react-toastify/dist/ReactToastify.css';
import TableLoader from '../TableLoader/table-loader';
import Pagination from '../pagination/Pagination';

const Question_list = () => {
  const [showModal, setShowModal] = useState(false);
  const [questions,setQuestions] = useState();
  const [questionDetails, setQuestionDetails] = useState(null);
  const [showquestionDetailModal, setShowquestionDetailModal] = useState(false);
  const [currenturl,setCurrenturl] = useState('question/question-list');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterparams,setFilterparams] = useState('');
  const [pagelength,setPagelength]= useState('');
  const [searchKey,setSearchKey] = useState();
  const [loading,setLoading] = useState(true);
  const [draftList, setDraftList] = useState(false);
  

  const fetchQuestions = async (page,filterparams,searchparam) => {
    setLoading(true)
    try {
      console.log("in fetch question",filterparams)
      const response = await questiontListing(page,filterparams,searchparam);
      console.log("in fetch response :",response.data)

      // setOriginalUsers(response.data.results)
      console.log("in fetch ,previous link",response?.data.previous)
      
      setTotalPages(response?.data?.total_pages);
      setQuestions(response?.data?.results);
      setPagelength(response?.data?.results.length)
      console.log("currentpage",currentPage)
    } 
    catch (error) {
      console.log('Error fetching questions:', error)
      console.error('Error fetching questions:', error);

    }
    finally{
      setLoading(false)
    }
  };
  const [questionShowModal, setQuestionShowModal] = useState(false);


  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if(pagelength==1){
      console.log("previous link in last delete ",previousLink)
      fetchQuestions(previousLink,filterparams);        
      setCurrentPage(currentPage-1===0 ? 1:currentPage-1);
    }
    else{   
      console.log("current page",currenturl)
      fetchQuestions(currenturl,filterparams,searchKey); 
      
    }  
    setShowModal(false);
    setShowquestionDetailModal(false);
    setQuestionShowModal(false);
  };

  const handleQuestionClick = async (questionid) => {
    const response = await questiontDetail(questionid);
    setQuestionDetails(response?.data)
    setShowquestionDetailModal(true)

  }
  useEffect(() => {
    const page=1
    fetchQuestions(page,filterparams,searchKey);
  }, [searchKey,filterparams]); 

  const handlePagination = async (page) => {
    toast.dismiss();
    const newcurrentPage = Math.max(1, page);
    setCurrentPage(newcurrentPage);
    fetchQuestions(page,filterparams,searchKey);

  };


const ApplyFilter = async (filter) => {
  console.log("inapplyfilter1",filter);
  setFilterparams(filter);
  fetchQuestions('question/question-list',filter);
}
const handleSearch = (key) => {
  console.log("in search",key)
  setCurrenturl('question/question-list')
  setSearchKey(key);
  setCurrentPage(1)
}
const GetDraftedQuetsions = () =>{

  let status=!draftList
  console.log("status : ",status)
  setDraftList(status)
  const filter = status===true?{is_drafted: "True" }:""
  console.log("filter : ------------------------------",filter)
  setFilterparams(filter);

}

  const handleQuestionOpenModal = () => {
    setQuestionShowModal(true);
  };

  const handleClearFilter = () => {
    setDraftList(false)
    setFilterparams('');
    setSearchKey('');
  };
console.log("questions empty : ",questions?.length)
  return (
<div className="row d-flex gy-2">
  <div className="row gy-3 align-items-center">
    <div className="col-md-8">
      <h2 className="main-heading">{draftList?"Drafted Questions":"Questions"}<button data-testid="drafted" type="button" className="btn btn-outline-secondary" onClick={GetDraftedQuetsions}>
        <RiDraftLine />
        </button></h2>     
    </div>
    
    <div className="col-md-4 text-md-end text-center mt-2 mt-md-0">
      <div className="button-position">
        <button type="button" className="btn btn-outline-primary" onClick={handleQuestionOpenModal} >ADD QUESTION +</button>
        <CreateQuestion show={questionShowModal} onHide={handleCloseModal} />
      </div>
    </div>

  </div>
  <div className="row gy-3 align-items-center">
  <div className="col-md-6 gy-3">
  <div className="input-group mb-3">
  <div className="search-box w-90"> {/* Add col-12 class here */}
    <i className="bi bi-search search-icon"></i>
    <input type="text" 
    className="form-control" 
    placeholder="Search..." 
    onChange={(e) => handleSearch(e.target.value)}
    aria-describedby="filter-button" />
    <FaSearch className="search-icon" />
  </div>

        <button type="button" className="button-60" onClick={handleOpenModal}
        id="filter-button" data-testid="filter">
<FaFilter />
        </button>
        <button
            type="button"
            className="button-60"
            onClick={handleClearFilter}
          >
            Clear Filter
          </button>
        </div>
      </div>

        <QuestionFilterModal 
        show={showModal} 
        onHide={handleCloseModal}
        onApplyFilters= {ApplyFilter} />

      {questions && questions.length > 0 ? (
  <div>
    <table className="table">
      <thead>
        <tr>
          <th style={{ width: '10px' }}>#</th>
          <th>Question Description</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((question, index) => (
          <tr key={question.id}>
            <td>{(currentPage - 1) * 3 + index + 1}</td>
            <td>
              <button className="clickable-question" onClick={() => handleQuestionClick(question.id)}>
              <p class="text-break"> {question.question_description}</p>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="pagination-items mt-3 d-flex justify-content-center">
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={totalPages}
          pageSize={6}
          setCurrentPage={setCurrentPage}

          onPageChange={handlePagination}
        />
      </div>

  </div>
) : (
  loading&& (
    <TableLoader />

))}
{questions?.length===0&&(
    <div className="text-center py-4">
      <p style={{ color: 'red' }}>No questions found.</p>
    </div>
  )}

{showquestionDetailModal && (
        <QuestionDetailModal
          questionDetails={questionDetails}
          onClose={handleCloseModal}
        />
      )}
    
    </div>
    <ToastContainer position={toast.POSITION.TOP_CENTER} autoClose={false} />

</div>
  );
};


export default Question_list;
