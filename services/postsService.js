import http from "./axiosService.js";
import Swal from "sweetalert2";

class postsService {
  getPosts(callback, error) {
    Swal.fire({
      title: "Cargando...",
      didOpen: () => {
        Swal.showLoading();
      },
    });

    http
      .get("api/posts")
      .then((response) => {
        Swal.close();
        callback(response.data);
      })
      .catch((response) => {
        Swal.hideLoading();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al cargar los posts.",
        });
      });
  }

  createPost(params, callback, error) {
    Swal.fire({
      title: "Confirmación de guardado",
      text: "¿Desea guardar este post?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si, guardar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Guardando...",
          didOpen: () => {
            Swal.showLoading();
          },
        });

        http
          .post("api/crear_post", params)
          .then((response) => {
            Swal.close();
            Swal.fire({
              icon: "success",
              title: "Proceso Éxitoso",
              text: "Post guardado correctamente.",
            });
            callback(response.data);
          })
          .catch((response) => {
            error(response.data);
            Swal.hideLoading();
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un error al guardar el post.",
            });
          });
      }
    });
  }

  deletePost(params, callback, error) {
    Swal.fire({
      title: "Confirmación de eliminación",
      text: "¿Desea eliminar el post??",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminando...",
          didOpen: () => {
            Swal.showLoading();
          },
        });

        http
          .patch(`api/delete_post/${params}`)
          .then((response) => {
            Swal.close();
            Swal.fire({
              icon: "success",
              title: "Proceso Éxitoso",
              text: "Post eliminado correctamente.",
            });
            callback(response.data);
          })
          .catch((response) => {
            error(response.data);
            Swal.hideLoading();
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un error al eliminar el post.",
            });
          });
      }
    });
  }
}
export default new postsService();
