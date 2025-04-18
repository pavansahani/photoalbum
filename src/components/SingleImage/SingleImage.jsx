import React from "react";
import styles from "./SingleImage.module.css";
import { IoMdClose, IoMdDownload, IoMdShare } from "react-icons/io";
import { MdDelete, MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";

const SingleImage = ({ image, handleClose, handleDeleteImage, handleNext, handlePrevious }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: `Check out this image: ${image.title}`,
          url: image.imageUrl,
        });
        console.log("Shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <h1>{image.title}</h1>
        <ul>
          {/* Download functionality */}
          <li>
            <a
              href={image.imageUrl}
              download={image.title || "image"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IoMdDownload />
            </a>
          </li>

          {/* Share functionality */}
          <li onClick={handleShare}>
            <IoMdShare />
          </li>

          {/* Delete functionality */}
          <li onClick={() => handleDeleteImage(image.id)}>
            <MdDelete />
          </li>

          {/* Close functionality */}
          <li onClick={handleClose}>
            <IoMdClose />
          </li>
        </ul>
      </div>

      <div className={styles.main}>
        <img src={image.imageUrl} alt={image.title} />
        <div className={styles.navigation}>
          <button onClick={handlePrevious} className={styles.prev}>
            <MdOutlineNavigateBefore />
          </button>
          <button onClick={handleNext} className={styles.next}>
            <MdOutlineNavigateNext />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleImage;
