"use client";
import { React, useState, useEffect,useRef } from "react";
import './profile.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegEdit, FaEnvelope, FaMapMarkerAlt, FaPhone,FaCamera,FaTrash } from "react-icons/fa";
import { viewProfile, applyeditchanges } from '@/services/ApiServices';
import { useForm } from "react-hook-form"
import { MDBContainer } from "mdb-react-ui-kit";
import { Modal, Button } from 'react-bootstrap';
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import setCanvasPreview from "@/utils/setCanvasPreview";
import { handleErrorResponse } from "@/middlewares/errorhandling";

import Swal from 'sweetalert2';
import Avatar from 'react-avatar';


const PROFILE_IMAGE_BASE_URL=process.env.NEXT_PUBLIC_PROFILE_IMAGE_BASE_URL

const Profile = () => {

  const ASPECT_RATIO = 1;
  const MIN_DIMENSION = 150;
 
 

  const APPLICATION_CONFIG = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const MULTIPART_CONFIG = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'onBlur', });

  const [profileData, setProfileData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editStatus,  setEditStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');
  const [dataUrl,setDataUrl] = useState("")
  const [error,setError] = useState("")
  const [profileImage,setProfileImage] = useState(null)
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const avatarRef = useRef()
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await viewProfile()
        setProfileImage(response.data.profile_image)
        console.log(response.data.profile_image)
       console.log(PROFILE_IMAGE_BASE_URL);
        setProfileData(response.data)
        
        resetProfileForm(response.data);
        setLoading(false)
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(()=>{
  if(showCanvas){
    setCanvasPreview(
      imgRef.current,
       previewCanvasRef.current, 
       convertToPixelCrop(
         crop,
         imgRef.current.width,
         imgRef.current.height
       )
     );
     setDataUrl(previewCanvasRef.current.toDataURL());
    
  }
  },[showCanvas])

  const resetProfileForm = (data) => {
    reset({
      email: data.email,
      username: data.username,
      address: data.address,
      contact_number: data.contact_number,
    });
  };



  const handleEditButton = async () => {
    setEditStatus(!editStatus)
  }

  const handleImage=()=>{
    setShowModal(true)
  }
  const handleApplychanges = async (data) => {
    
    try {
      const response = await applyeditchanges(data,APPLICATION_CONFIG)
      if (response.status === 200) {
        toast.success("Profile updated successfully")
      }
    }
    catch (error) {
      toast.error(error)
      console.log(error)
    }
    finally {
      setEditStatus(false)
    }
  }

  const renderProfileField = (label, value, inputName, placeholder, validation) => {
    return editStatus ? (
      <input
        type="text"
        placeholder={placeholder}
        className={`form-control ${errors[inputName] ? 'is-invalid' : ''}`}
        id={inputName}
        name={inputName}
        defaultValue={value}
        {...register(inputName, validation)}
      />
    ) : (
      <p className="text-break">{value}</p>
    );
  };

  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg','image/jpg', 'image/png']; 
    if (!allowedTypes.includes(file.type)) {
    setError("Please select a image file");
    setImgSrc(""); 
    return;
  }

    const { name, type } = file;
    setSelectedFileName(name);
    setSelectedFileType(type);



    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (error){
        setError("")
      }
      const imageUrl = reader.result?.toString() || "";
      const fileSizeInBytes = file.size;
      const maxSizeInBytes = 10 * 1024 * 1024;
     
     

      if(fileSizeInBytes > maxSizeInBytes){
        setError("Image size should be less than 10 MB");
        setImgSrc("")
        return;
      }
     
      setImgSrc(imageUrl);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const cropImage = ()=>{
    setShowCanvas(true)
    if(showCanvas){
      setCanvasPreview(
        imgRef.current,
         previewCanvasRef.current, 
         convertToPixelCrop(
           crop,
           imgRef.current.width,
           imgRef.current.height
         )
       );
       setDataUrl(previewCanvasRef.current.toDataURL());
      
    }
    
   
  }

  const closeModal=()=>{
    setDataUrl("")
    setImgSrc("")
    setShowModal(false)
    setShowCanvas(false)

    
  }


  const SaveImage =async ()=>{
   
   if(dataUrl!==""){
    const base64Response=await fetch(dataUrl)
    console.log("From Save image data url",dataUrl)
    console.log("base64Response",base64Response)
    const blob = await base64Response.blob();
    console.log("Blob type",blob.type)
    console.log("Blob",blob)
    const file = new File([blob], selectedFileName, { type: selectedFileType });
    setProfileImage(file)
    console.log("File",file)
    try{
      const formData = new FormData();
      console.log('Before append:', formData); 
      formData.append('profile_image', file);
      
    
      
      const response = await applyeditchanges(formData,MULTIPART_CONFIG)
      if (response.status === 200) {
        toast.success("Photo Uploaded successfully",{ autoClose: 2000 })
        setShowCanvas(false)
        setImgSrc("")
      }
    }catch (error){
     
      handleErrorResponse(error)
    }
    avatarRef.current.src=dataUrl;
    setShowModal(false)
 
   }else{
    setShowModal(false)
   }
  
 

  }

  const removeImage=()=>{
    setShowModal(false)
    Swal.fire({
      title: "Are you sure?",
      text: "Remove Profile Photo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Remove"
    }).then(async(result) => {
      if (result.isConfirmed) {
        try{
          await applyeditchanges({remove_profile_image:true},APPLICATION_CONFIG)
          
          console.log("toast called");
          toast.success("Profile Image removed successfully",{ autoClose: 2000 })
          setProfileImage(null)
        }
        catch(error){
          handleErrorResponse(error)
        }
        
      }
    });
  }


  


  return (
    <>

    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f4f5f7' }}>
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 mb-4 mb-lg-0">
              <div className="card mb-3 custom-card" style={{ borderRadius: '.5rem' }}>
                <div className="row g-0">
                  <div className="col-md-4 gradient-custom text-center text-white"
                    style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                    <MDBContainer className="my-5 d-flex flex-column justify-content-center align-items-center">
                      <div className="profile-picture-container">
                      {profileImage ? (
    <img
      ref={avatarRef}
      src={`${PROFILE_IMAGE_BASE_URL}${profileImage}`}
      className="rounded-circle mb-3"
      style={{ width: "150px" }}
      alt="Avatar"
    />
  ) : (
    <Avatar
    
      name={profileData.username} 
      size="150"
      round
      style={{ width: "150px", height: "150px" }}
    />
  )}
                     
                      <div onClick={handleImage} data-testid="edit-button" className="camera-icon">
                        <FaCamera size={15} color="#fff" />
                      </div>
                       </div>

                     
                      
                     
                    </MDBContainer>
                    {editStatus ? (<div>
                      <input data-testid='name' type="text"
                        placeholder="Organization name"
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        id="name"
                        style={{ backgroundColor: 'transparent', border: 'none', borderBottom: 'none' }}
                        name="name" {...register("username", { required: true, pattern: /^[a-zA-Z\s'-]+$/ })} />
                      {errors.username && (
                        <div className="invalid-feedback">
                          Invalid organization name.
                        </div>
                      )}

                    </div>) : (
                      <h5>{profileData.username}</h5>)}
                    {editStatus ? (<button data-testid="apply changes" className="btn btn-outline-light" onClick={handleSubmit(handleApplychanges)}><p>APPLY CHANGES</p></button>) : (<button class="btn btn-outline-light" data-testid="edit button" onClick={handleEditButton}><FaRegEdit /></button>)}

                  </div>

                  <div className="col-md-8">
                    <div className="card-body p-4 custom-card">
                      <div style={{ marginTop: '6rem', height: "20rem" }}>
                      <h6> <FaEnvelope />  Email</h6>
                        <hr style={{ margin: '1rem' }} />
                        <p className="text-break">{profileData.email}</p>
                        <h6> <FaMapMarkerAlt /> Address</h6>
                        <hr style={{ margin: '1rem' }} />
                        {renderProfileField("Address", profileData.address, "address", "Address", { required: true, pattern: /^[a-zA-Z0-9\s,'-]*$/ })}
                        <h6><FaPhone />  Contact</h6>
                        <hr style={{ margin: '1rem' }} />
                        {renderProfileField("Contact", profileData.contact_number, "contact_number", "Contact", { required: true, pattern: /^[6-9]\d{9}$/ })}
</div>
                        
      
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
       
      )}
      <ToastContainer position="top-right" autoClose={false} />
      <Modal show={showModal} onHide={closeModal}  centered backdrop >
        <Modal.Header >
          <Modal.Title>Profile Photo</Modal.Title>
          {profileImage && <div data-testid="remove-button" onClick={removeImage} style={{color:"red"}}> <FaTrash /></div>}
        </Modal.Header>
        <Modal.Body>
          <input type="file" onChange={onSelectFile} data-testid='file-input' />
           
           {error && <p className="text-danger">{error}</p>}
          {imgSrc && (
        <div className="flex flex-col items-center mt-2">
          <ReactCrop
            crop={crop}
            onChange={(percentCrop) => setCrop(percentCrop)}
            circularCrop
            keepSelection
            aspect={ASPECT_RATIO}
            minWidth={MIN_DIMENSION}
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Upload"
              style={{ maxHeight: "70vh" }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
          
         
        </div>
      )}
        </Modal.Body>
        <Modal.Footer>
          {showCanvas && <canvas
     ref={previewCanvasRef}
     className="mt-4"
     style={{
      
       border: "1px solid black",
       objectFit: "contain",
       width: 150,
       height: 150,
     }}
   /> }
        
   {imgSrc && <Button
        variant="primary"
            data-testid="crop-button"
            onClick={cropImage}
          >
            Crop Image
          </Button> }

    {previewCanvasRef.current &&  <Button variant="success" data-testid="upload-button" onClick={SaveImage}>
            Upload
          </Button> }
       
         
          <Button variant="danger" data-testid="close-button" onClick={closeModal}>
            Close
          </Button>
         
        </Modal.Footer>
      </Modal>
    </div>
     
   </>
  );
};

export default Profile;