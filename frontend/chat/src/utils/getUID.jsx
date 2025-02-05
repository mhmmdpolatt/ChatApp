const getUID = () => {
    try {
        let uid = sessionStorage.getItem("uid"); // sessionStorage kullandım çünkü her sekmede farklı id oluşsun diye localstorgae aynı bırakıyor
        if (!uid) {
            uid = `user-${Math.random().toString(36).slice(2, 11)}`;
            sessionStorage.setItem("uid", uid);
        }
        return uid;

    } catch (error) {
        console.log("UID OLUŞTURULURKEN HATA",error);
        throw new Error("HATA UID")
        
    }

};

export default getUID;
