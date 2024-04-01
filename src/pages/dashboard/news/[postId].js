import { useEffect, useState } from "react";
import Head from "next/head";
import { Box, Container, Stack, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useRouter } from "next/router";
import { Layout as DashboardLayout } from "../../../layouts/dashboard";
import axios from "axios";
import Image from "next/image";
import { paths } from "../../../paths";
import toast from "react-hot-toast";


const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

const useNewsDetail = () => {
  const router = useRouter();
  const [newsDetail, setNewsDetail] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const { postId } = router.query;
        const token = localStorage.getItem("accessToken");
        const headers = {
          Authorization: token,
        };

        const response = await axios.get(`${BASEURL}/api/Blog/getAllBlogs`, {
          headers: headers,
        });

        console.log("API response:", response.data); // Log API response

        const foundArticle = response.data.blogs.find(
          (article) => article.blogId === postId
        );
        console.log("Found article:", foundArticle); // Log fetched news article

        setNewsDetail(foundArticle);
      } catch (error) {
        console.error("Error fetching news detail:", error);
      }
    };

    if (router.query.postId) {
      fetchNewsDetail();
    }
  }, [router.query.postId]);

  return newsDetail;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return date.toLocaleString(undefined, options); // Adjust locale as per requirement
};


const NewsDetailPage = () => {
  const router = useRouter();
  const newsDetail = useNewsDetail();
  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const { postId } = router.query;

      const headers = {
        Authorization: token,
      };

      await axios.delete(`${BASEURL}/api/Blog/deleteBlog/${postId}`, {
        headers: headers,
      });
      toast.success("News Deleted");


      router.push(paths.dashboard.news.list); // Redirect to dashboard after successful deletion
    } catch (error) {
      console.error("Error deleting news article:", error);
    }
  };

  const handleConfirmDelete = () => {
    setOpenDialog(false);
    handleDelete();
  };

  if (!newsDetail) {
    return null; // Add loading indicator or error handling
  }

  return (
    <>
      <Head>
        <title>{newsDetail.title} | Rock34x</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Typography variant="h3">{newsDetail.title}</Typography>
            <Typography variant="subtitle1">{formatDate(newsDetail.createdAt)}</Typography>
            <Typography variant="body1">{newsDetail.content}</Typography>
            <Image
              src={
                newsDetail.imageUrls[0]
                  ? newsDetail.imageUrls[0]
                  : "/assets/covers/abstract-1-4x3-large.png"
              }
              width={600}
              height={300}
              alt={newsDetail.title}
            />
          </Stack>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDialog(true)}
            sx={{ mt: 2 }} // Add margin top to create space between the button and the content above
          >
            Delete
          </Button>
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to delete this news?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={handleConfirmDelete} color="error">Delete</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  );
};

NewsDetailPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default NewsDetailPage;
