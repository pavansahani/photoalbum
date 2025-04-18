import { useEffect, useState } from "react";
import styles from "./ImageList.module.css";
import { db, storage } from "../../firebaseinit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backbtn from "./back.png";
import { FaEye, FaPen } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { MdFileUpload } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

import {
  collection,
  addDoc,
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
import SingleImage from "../SingleImage/SingleImage";

const ImageList = ({ album, onBackClick }) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [images, setImages] = useState([]);
  const [editImageId, setEditImageId] = useState(null);
  const [viewImage, setViewImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the currently viewed image index

  const uploadFile = (path, file) => {
    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(ref(storage, path), file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => resolve(downloadURL))
            .catch((error) => reject(error));
        }
      );
    });
  };

  const handleToggleForm = () => {
    setShowForm(!showForm);
    handleClearInput();
  };

  const handleAddImage = async () => {
    try {
      let imgUrl = imageUrl;
      if (imageFile) {
        imgUrl = await uploadFile(`images/${imageFile.name}`, imageFile);
      }

      if (editImageId) {
        await setDoc(doc(db, "images", editImageId), {
          albumId: album.id,
          title,
          imageUrl: imgUrl,
        });
        toast.success("Image Updated Successfully");
      } else {
        await addDoc(collection(db, "images"), {
          albumId: album.id,
          title,
          imageUrl: imgUrl,
        });
        toast.success("Image Added Successfully");
      }

      handleClearInput();
      setShowForm(false);
    } catch (error) {
      console.error("Error in adding/updating images to database: ", error);
    }
  };

  const handleClearInput = () => {
    setTitle("");
    setImageUrl("");
    setImageFile(null);
    setEditImageId(null);
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await deleteDoc(doc(db, "images", imageId));
      toast.error("Image Deleted Successfully");
    } catch (error) {
      console.error("Error in deleting images from database: ", error);
    } finally {
      setViewImage(false);
    }
  };

  const handleEditImage = (image) => {
    setTitle(image.title);
    setImageUrl(image.imageUrl);
    setImageFile(null);
    setEditImageId(image.id);
    setShowForm(true);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setViewImage(images[nextIndex]);
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    setViewImage(images[prevIndex]);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "images"),
      (querySnapshot) => {
        const imageData = querySnapshot.docs
          .filter((doc) => doc.data().albumId === album.id)
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        setImages(imageData);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [album]);

  return (
    <div className={styles.main}>
      <div className={styles.top}>
        <img
          src={backbtn}
          alt="back.png"
          className="back"
          onClick={onBackClick}
          loading="lazy"
        />
        <h1>
          {images.length === 0 ? `No Images in ${album.name}` : `Images in ${album.name}`}
        </h1>
        <button className="add" onClick={handleToggleForm}>
          {showForm ? "Cancel" : "Add Image"}
        </button>
      </div>
      {showForm && (
        <div className={styles.form}>
          <h1>{editImageId ? "Edit Image" : "Add Image"}</h1>
          {(imageUrl || imageFile) && (
            <div className={styles.imgDemo}>
              <img
                className={styles.demo}
                src={imageUrl || URL.createObjectURL(imageFile)}
                alt="demo"
                loading="lazy"
              />
              <span onClick={() => (setImageFile(null), setImageUrl(""))}>
                <IoMdClose />
              </span>
            </div>
          )}
          <div className={styles.inputs}>
            <input
              className={styles.textInp}
              type="text"
              placeholder="Enter Image Title here"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            <div className={styles.urlInput}>
              <input
                type="text"
                placeholder="Enter Image Url or upload a file"
                required
                value={
                  editImageId && !imageFile
                    ? imageUrl
                    : imageFile
                    ? imageFile.name
                    : imageUrl
                }
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={!!imageFile}
                autoFocus
              />
              <label htmlFor="fileUpload">
                <MdFileUpload />
              </label>
              <input
                type="file"
                name="fileUpload"
                id="fileUpload"
                onChange={(e) => setImageFile(e.target.files[0])}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <div className="imagelist-btn">
            <button className="clear" onClick={handleClearInput}>
              Clear
            </button>
            <button className="add" onClick={handleAddImage}>
              {editImageId ? "Update" : "Add"}
            </button>
          </div>
        </div>
      )}

      <div className={styles.images}>
        {images.map((image, index) => (
          <div className={styles.imageCont} key={image.id}>
            <div className={styles.btns}>
              <FaPen
                size={19}
                color="blue"
                className={styles.edit}
                onClick={() => handleEditImage(image)}
              />
              <RiDeleteBin5Fill
                size={19}
                color="red"
                className={styles.delete}
                onClick={() => handleDeleteImage(image.id)}
              />
            </div>
            <img
              src={image.imageUrl}
              alt={image.title}
              className={styles.mainImage}
              loading="lazy"
            />
            <h1>{image.title}</h1>
            <div className={styles.overlay}>
              <span onClick={() => {
                setViewImage(image);
                setCurrentIndex(index);
              }}>
                <HiOutlineViewfinderCircle />
              </span>
            </div>
          </div>
        ))}
      </div>

      {viewImage && (
        <SingleImage
          image={viewImage}
          handleClose={() => setViewImage(null)}
          handleDeleteImage={handleDeleteImage}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
        />
      )}
    </div>
  );
};

export default ImageList;
