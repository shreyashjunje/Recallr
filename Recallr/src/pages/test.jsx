  const fetchUserProfile=async ()=>{
    try{

      const token=localStorage.getItem("token")
      if(!token) return;
      

      const res=await axios.get(`${API_URL}/user/full-profile`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })

      if(res.status===200){
        setUser(res.data.data)
        toast.success("user fetched successfully")
      }

    }catch(err){
      console.log("Error:",err);
      toast.error(err.message)
    }
  }

  useEffect(()=>{
    fetchUserProfile()
  },[])


  const API_URL=import.meta.env.VITE_API_URL
