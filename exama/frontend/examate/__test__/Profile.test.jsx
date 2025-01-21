import Profile from "@/components/Consumer/Profile/Profile";
import { viewProfile,applyeditchanges } from "@/services/ApiServices";
import {  toast } from 'react-toastify';
import { render, screen, waitFor,fireEvent } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import setCanvasPreview from "@/utils/setCanvasPreview";
import { handleErrorResponse } from "@/middlewares/errorhandling";
import swal from "sweetalert2";
import Swal from "sweetalert2";
import { useState } from "react";
import { message } from "antd";








jest.mock('react-toastify'); 
jest.mock('@/services/ApiServices');

jest.mock("@/services/ApiServices", () => ({
  applyeditchanges: jest.fn(),
  viewProfile: jest.fn().mockResolvedValue({
    data: {
      profile_image: 'mock_profile_image_url',
      username: 'test Organization',
    email: 'organization@gmail.com',
    address: 'test organization address',
    contact_number: '9887766554',
    },
  }),
}));
jest.mock("react-toastify", () => ({
  ...jest.requireActual("react-toastify"),
  toast: {
    POSITION: { TOP_CENTER: jest.fn() },
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
    info: jest.fn(),
  },
}));
jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
}));


HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  save: jest.fn(),
  scale: jest.fn(),
  translate: jest.fn(),
  drawImage: jest.fn(),
  restore: jest.fn(),
}));






const mockProfileData = {
  data: {
    username: 'test Organization',
    email: 'organization@gmail.com',
    address: 'test organization address',
    contact_number: '9887766554',
  },
};

describe('Profile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });
  test('renders profile information correctly when data is fetched', async () => {
  
    viewProfile.mockResolvedValueOnce(mockProfileData);

    render(<Profile />);

    await waitFor(() => {
    
      expect(screen.getByText(mockProfileData.data.username)).toBeInTheDocument();
    
    });
  });



  test('click edit option', async () => {
  
    viewProfile.mockResolvedValueOnce(mockProfileData);

    render(<Profile />);

    await waitFor(() => {

    
      expect(screen.getByText(mockProfileData.data.username)).toBeInTheDocument();
      const editButton = screen.getByTestId("edit button")
      fireEvent.click(editButton);
      const applychangesButton = screen.getByTestId("apply changes")
      fireEvent.click(applychangesButton)
    
    });
  });

  test('handle image upload',async()=>{
    const mockFetch = jest.fn();
    global.fetch = mockFetch;
    const responseData = { type: 'basic', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA0oA…zm9gH+0OnukWpM+3Xb0f5L9mUr87T6Zz4AAAAAElFTkSuQmCC', redirected: false, status: 200, ok: true };
    const blob = new Blob([JSON.stringify(responseData)], { type: 'application/json' });

  const base64Response = {
    blob: jest.fn().mockResolvedValueOnce(blob)
  };
  global.fetch.mockResolvedValueOnce(base64Response);
 
  applyeditchanges.mockResolvedValueOnce({response:{data:"Profile image uploaded successfully"},status:200})
 
    render(<Profile/>)
    await waitFor(()=>{
      userEvent.click(screen.getByTestId("edit-button"))

    })
    
    await waitFor(()=>{
      const fileInput = screen.getByTestId("file-input")
      const testFile = new File(["avatar"],'avatar.jpg',{type:'image/jpeg'})
      userEvent.upload(fileInput,testFile)
      expect(fileInput.files).toHaveLength(1);

    const imgElement = screen.getByAltText('Upload'); 
    const imageWidth = 800;
    const imageHeight = 600;
    const cropWidthPercent = (150 / imageWidth) * 100; 

    const mockCrop = { x: 0, y: 0, width: 100, height: 100 }
   
    fireEvent.load(imgElement, { currentTarget: { width: imageWidth, height: imageHeight } });
    
   
    fireEvent.click(screen.getByTestId("crop-button"))
    fireEvent.click(screen.getByTestId("upload-button"))
    fireEvent.click(screen.getByTestId("close-button"))

      
   
    })
   
    await waitFor(()=>{
      expect(applyeditchanges).toHaveBeenCalled();
      
    })
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Photo Uploaded successfully", { 'autoClose': 2000 });
  });

   
  })


  test('handle image upload gretaer than 10MB',async()=>{
    const mockFetch = jest.fn();
    global.fetch = mockFetch;
    const responseData = { type: 'basic', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA0oA…zm9gH+0OnukWpM+3Xb0f5L9mUr87T6Zz4AAAAAElFTkSuQmCC', redirected: false, status: 200, ok: true };
    const blob = new Blob([JSON.stringify(responseData)], { type: 'application/json' });

  const base64Response = {
    blob: jest.fn().mockResolvedValueOnce(blob)
  };
  global.fetch.mockResolvedValueOnce(base64Response);
  applyeditchanges.mockResolvedValueOnce({response:{data:"Profile image uploaded successfully",status:200}})
 
    render(<Profile/>)
    await waitFor(()=>{
      userEvent.click(screen.getByTestId("edit-button"))

    })
    await waitFor(()=>{
      const fileInput = screen.getByTestId("file-input")
      const testFile = new File(["avatar"],'avatar.jpg',{type:'image/jpeg'})
      Object.defineProperty(testFile, 'size', { value: 20 * 1024 * 1024 });
      userEvent.upload(fileInput,testFile)
      expect(fileInput.files).toHaveLength(1);
   
    })
   
    await waitFor(()=>{
      expect(screen.getByText("Image size should be less than 10 MB")).toBeInTheDocument();
      
    })

   
  })



  test('handle image upload error',async()=>{
    const mockFetch = jest.fn();
    global.fetch = mockFetch;
    const responseData = { type: 'basic', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA0oA…zm9gH+0OnukWpM+3Xb0f5L9mUr87T6Zz4AAAAAElFTkSuQmCC', redirected: false, status: 200, ok: true };
    const blob = new Blob([JSON.stringify(responseData)], { type: 'application/json' });

  const base64Response = {
    blob: jest.fn().mockResolvedValueOnce(blob)
  };
  global.fetch.mockResolvedValueOnce(base64Response);
 
  applyeditchanges.mockRejectedValueOnce({ response: { data: { message: 'Mocked error' } } });
    render(<Profile/>)
    await waitFor(()=>{
      userEvent.click(screen.getByTestId("edit-button"))

    })
    await waitFor(()=>{
      const fileInput = screen.getByTestId("file-input")
      const testFile = new File(["avatar"],'avatar.jpg',{type:'image/jpeg'})
      userEvent.upload(fileInput,testFile)
      expect(fileInput.files).toHaveLength(1);

    const imgElement = screen.getByAltText('Upload'); 
    const imageWidth = 800;
    const imageHeight = 600;
    const cropWidthPercent = (150 / imageWidth) * 100; 

    const mockCrop = { x: 0, y: 0, width: 100, height: 100 }
   
    fireEvent.load(imgElement, { currentTarget: { width: imageWidth, height: imageHeight } });
    
   
    fireEvent.click(screen.getByTestId("crop-button"))
    fireEvent.click(screen.getByTestId("upload-button"))

      
   
    })
   
    await waitFor(()=>{
      expect(applyeditchanges).toHaveBeenCalled();
     
    })

   
  })

  test('handle image upload unexpected error',async()=>{
  
    const mockFetch = jest.fn();
    global.fetch = mockFetch;
    const responseData = { type: 'basic', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA0oA…zm9gH+0OnukWpM+3Xb0f5L9mUr87T6Zz4AAAAAElFTkSuQmCC', redirected: false, status: 200, ok: true };
    const blob = new Blob([JSON.stringify(responseData)], { type: 'application/json' });

  const base64Response = {
    blob: jest.fn().mockResolvedValueOnce(blob)
  };
  global.fetch.mockResolvedValueOnce(base64Response);
 
 
  applyeditchanges.mockRejectedValue({ response: { data: {} } });
    render(<Profile/>)
    await waitFor(()=>{
      userEvent.click(screen.getByTestId("edit-button"))

    })
    await waitFor(()=>{
      const fileInput = screen.getByTestId("file-input")
      const testFile = new File(["avatar"],'avatar.jpg',{type:'image/jpeg'})
      userEvent.upload(fileInput,testFile)
      expect(fileInput.files).toHaveLength(1);

    const imgElement = screen.getByAltText('Upload'); 
    const imageWidth = 800;
    const imageHeight = 600;
    const cropWidthPercent = (150 / imageWidth) * 100; 

    const mockCrop = { x: 0, y: 0, width: 100, height: 100 }
   
    fireEvent.load(imgElement, { currentTarget: { width: imageWidth, height: imageHeight } });
    
   
    fireEvent.click(screen.getByTestId("crop-button"))
    fireEvent.click(screen.getByTestId("upload-button"))

      
   
    })
   
    await waitFor(()=>{
      expect(applyeditchanges).toHaveBeenCalled();
     
    })
    await waitFor(()=>{
      expect(toast.error).toHaveBeenCalled();
    })
   
   
  })

  it('renders canvas with correct dimensions after setting preview', () => {
  
    const image = new Image();
    image.width = 400; 
    image.height = 300;
    jest.spyOn(image, 'naturalWidth', 'get').mockImplementation(() => 800);
    jest.spyOn(image, 'naturalHeight', 'get').mockImplementation(() => 600);


    const canvas = document.createElement('canvas');
    canvas.width = 200; 
    canvas.height = 150; 

   
    const crop = {
      x: 100, 
      y: 80, 
      width: 300, 
      height: 200 
    };

    const getContextSpy = jest.spyOn(canvas, 'getContext').mockReturnValue({
      scale: jest.fn(), 
      save: jest.fn(),
      restore: jest.fn(),
      drawImage: jest.fn(),
      translate:jest.fn()
    });


   

   
    setCanvasPreview(image, canvas, crop);

   
   
    expect(canvas.width).toBe(600); 
    expect(canvas.height).toBe(400);

    expect(getContextSpy).toHaveBeenCalledWith('2d');

  
   
    
  });
  
  it('handle error response', () => {
    const error = {
      response: {
        data: {
          message: 'Custom error message',
        },
      },
    };

    handleErrorResponse(error);

   
    expect(toast.error).toHaveBeenCalledWith('Custom error message', { autoClose: 2000 });
  })

  it('handle unexpected error response', () => {
    
    
    const error = {
      response: {
        data: {
        
        },
      },
    };

    handleErrorResponse(error);

   
    expect(toast.error).toHaveBeenCalledWith('Network unable to connect to the server', { autoClose: 2000 });
  })
  test('handle image remove',async()=>{
   
 
    applyeditchanges.mockResolvedValue({
      response: {
        data: {
          message: "Profile Image removed successfully"
        }
      }
    });
    
    render(<Profile/>)
    await waitFor(()=>{
      userEvent.click(screen.getByTestId("edit-button"))

    })
    
    await waitFor(() => {
      expect(screen.getByTestId('remove-button')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId("remove-button"))
    await waitFor(()=>{
      expect(Swal.fire).toHaveBeenCalled()
      expect(applyeditchanges).toHaveBeenCalled()
     
    })

   
   
   
 
   
   
  })

  test('handle image remove error',async()=>{
   
 
    applyeditchanges.mockRejectedValue({ response: { data:"profile photo remove failed" } });
    render(<Profile/>)
    await waitFor(()=>{
      userEvent.click(screen.getByTestId("edit-button"))

    })
    
    await waitFor(() => {
      expect(screen.getByTestId('remove-button')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId("remove-button"))
    await waitFor(()=>{
      expect(Swal.fire).toHaveBeenCalled()
      expect(applyeditchanges).toHaveBeenCalled()
      expect(toast.error).toHaveBeenCalled()
    })
   
   
 
   
   
  })

  test('handle image upload with invalid type',async()=>{
    const mockFetch = jest.fn();
    global.fetch = mockFetch;
    const responseData = { type: 'basic', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA0oA…zm9gH+0OnukWpM+3Xb0f5L9mUr87T6Zz4AAAAAElFTkSuQmCC', redirected: false, status: 200, ok: true };
    const blob = new Blob([JSON.stringify(responseData)], { type: 'application/json' });

  const base64Response = {
    blob: jest.fn().mockResolvedValueOnce(blob)
  };
  global.fetch.mockResolvedValueOnce(base64Response);
  applyeditchanges.mockResolvedValueOnce({response:{data:"Profile image uploaded successfully",status:200}})
 
    render(<Profile/>)
    await waitFor(()=>{
      userEvent.click(screen.getByTestId("edit-button"))

    })
    await waitFor(()=>{
      const fileInput = screen.getByTestId("file-input")
      const testFile = new File(["avatar"],'avatar.pdf',{type:'image/pdf'})
     
      userEvent.upload(fileInput,testFile)
      expect(fileInput.files).toHaveLength(1);
   
    })
   
    await waitFor(()=>{
      expect(screen.getByText("Please select a image file")).toBeInTheDocument();
      
    })

   
  })
});

