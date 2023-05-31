<>
  <div className="collapse collapse-horizontal card" id="collapseWidthExample">
    <div className="row  p-3">
      <div className="col-12 col-md-4">
        <div className="mb-3">
          <select
            id="disabledSelect"
            className="select-custom"
            value={newfilters.area}
            onChange={(e) =>
              setNewfilters({ area: e.target.value, cate: newfilters.cate })
            }
          >
            <option value="">Areá</option>
            {areas?.map((item) => (
              <option value={item.code} key={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="mb-3">
          <select
            id="disabledSelect"
            className="select-custom"
            value={newfilters.cate}
            onChange={(e) =>
              setNewfilters({ cate: e.target.value, area: newfilters.area })
            }
          >
            <option value="">Categoria</option>
            {categories?.map((item) => (
              <option value={item._id} key={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="col-12 col-md-4 self-center text-center">
        <div className="">
          {newfilters.area && newfilters.cate ? (
            <button
              className="hover:bg-yellow-700 hover:text-yellow-700 bg-yellow-500 text-white font-bold py-2 px-4 rounded-full"
              onClick={newFiltro}
            >
              Filtrar
            </button>
          ) : null}
          {showreset ? (
            <button
              className="hover:bg-
              yellow-700 hover:text-yellow-700 bg-yellow-500 text-white font-bold py-2 px-4 rounded-full ml-1"
              onClick={resetFilters}
            >
              Posts públicos
            </button>
          ) : null}
        </div>
      </div>
    </div>
  </div>
  <div className="row mt-3">
    <div className="col-6 col-md-3">
      <button
        className="hover:bg-gray-700 hover:text-gray-700 bg-gray-500 text-white font-bold py-2 px-4 rounded-full"
        onClick={handleRefresh}
      >
        Actualizar posts
      </button>
    </div>
    {me?.role === "Administrador" ? (
      <div className="col-6 col-md-3">
        <button
          className="hover:bg-blue-700 hover:text-blue-700 bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseWidthExample"
          aria-expanded="false"
          aria-controls="collapseWidthExample"
        >
          Ver/Ocultar Filtro
        </button>
      </div>
    ) : null}
  </div>
  {/* solo admin */}
  {me?.role === "Administrador" ? (
    <>
      <div className="card lg:mx-0 p-4 mt-3">
        <div className="flex space-x-3">
          <input
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            placeholder="Publicar nuevo post..."
            className="bg-gray-100 hover:bg-gray-200 flex-1 h-10 px-6 rounded-full"
          />
        </div>
      </div>
      {/* Modal create New post*/}
      <ModalPer
        id="exampleModal"
        estils="modal-dialog-centered"
        title="Crear post"
        btncloseAdd={btncloseAdd}
      >
        {/* go post */}
        <div className="flex flex-1 items-start space-x-4 p-2">
          <img
            src="assets/images/avatars/avatar-2.jpg"
            className="bg-gray-200 border border-white rounded-full w-11 h-11"
          />
          <div className="flex-1 pt-2">
            <textarea
              className="uk-textare text-black shadow-none focus:shadow-none text-xl font-medium resize-none tareaPost"
              rows={5}
              placeholder="Escribir una descripción"
              value={txt.des}
              required={true}
              onChange={(e) => setTxt({ ...txt, des: e.target.value })}
            />
          </div>
        </div>
        <div className="row p-2">
          {filesdata?.map((it, index) => (
            <div
              className="col-4 text-end"
              key={it.id}
              onClick={() => removeImage(it.id)}
            >
              <button
                type="button text-end"
                className="btn-close bg-gray-100 rounded-full"
              ></button>
              <img src={it.url} alt="" className="img-fluid" />
            </div>
          ))}
        </div>
        <ol className="list-group">
          {docsdata?.map((it) => (
            <li
              className="list-group-item d-flex justify-content-between align-items-start"
              key={it.id}
            >
              <div className="ms-2 me-auto">{it.name}</div>
              <span
                className="badge bg-danger rounded-pill poiter bg-gray-100 rounded-full"
                onClick={() => removeDocs(it.id)}
              >
                X
              </span>
            </li>
          ))}
        </ol>

        {!iconDoc && !icoImg ? (
          <input
            type="text"
            id="txturlvideo"
            className="form-control focus:outline-none focus:ring focus:border-blue-300 inputvideo"
            placeholder="ejem: https://youtu.be/mN9RSnu_xDc"
            value={urlvideo}
            onChange={(e) => seturlvideo(e.target.value)}
          />
        ) : null}

        <div className="bsolute bottom-0 p-2 space-x-4 w-full">
          <div className="flex bg-gray-50 border border-purple-100 rounded-2xl p-2 shadow-sm items-center">
            <div className="flex flex-1 items-center  justify-center space-x-2">
              {icoImg ? (
                <FilesImgs
                  setfilesdata={setfilesdata}
                  filesdata={filesdata}
                  seticonVideo={seticonVideo}
                  seticonDoc={seticonDoc}
                ></FilesImgs>
              ) : null}
              {iconVideo ? (
                <svg
                  className="text-red-600 h-9 p-1.5 rounded-full bg-red-100 w-9 cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={sendVideo}
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  >
                    {" "}
                  </path>
                </svg>
              ) : null}
              {iconDoc ? (
                <FileDocs
                  setdocsdata={setdocsdata}
                  docsdata={docsdata}
                  seticoImg={seticoImg}
                  seticonVideo={seticonVideo}
                ></FileDocs>
              ) : null}

              <img
                onClick={resetValues}
                src="/posts/reset.png"
                alt=""
                width=""
                className="text-orange-600 h-9 p-1.5 rounded-full bg-yellow-100 w-9 cursor-pointer"
              />
            </div>
          </div>
        </div>
        <div className="row border-t">
          <div className="col-12">
            <select
              className="select-custom mt-2"
              value={txt.cate}
              onChange={(e) => setTxt({ ...txt, cate: e.target.value })}
            >
              <option value="">Elegir Categoria</option>
              {categories?.map((item) => (
                <option value={item._id} key={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <select
              className="select-custom mt-2"
              value={txt.area}
              onChange={(e) => setTxt({ ...txt, area: e.target.value })}
            >
              <option value="feed">Público</option>
              {areas?.map((item) => (
                <option value={item.code} key={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 text-end">
            <button className="btn btn-primary" onClick={publishPost}>
              {loader ? (
                <span
                  className="spinner-border spinner-border-sm mr-1"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : null}
              Publicar
            </button>
          </div>
        </div>

        {/* end post */}
      </ModalPer>
    </>
  ) : null}
  {/* list */}
  {posts?.map((item) => (
    <ListPost
      key={item._id}
      posts={item}
      userLikes={userLikes}
      setuserLikes={setuserLikes}
      pageLikesuser={pageLikesuser}
      setpageLikesuser={setpageLikesuser}
      nextpageLiked={nextpageLiked}
      setposts={setposts}
      dataposts={posts}
    ></ListPost>
  ))}
  <div className="flex justify-center mt-6">
    <a
      className="bg-white dark:bg-gray-900 font-semibold my-3 px-6 py-2 rounded-full shadow-md dark:bg-gray-800 dark:text-white poiter"
      onClick={morePosts}
    >
      Cargar más ..
    </a>
  </div>

  {/* likesss */}

  <ModalSimple
    id="viewLiked"
    estils="modal-dialog-centered modal-md modal-dialog-scrollable"
    title=""
    closeBtn={cleardatalikedusers}
  >
    <div className="border-b flex items-center justify-between  p-2">
      <div>
        <h2 className="text-md font-semibold">Total Me gusta</h2>
      </div>
      <a className="text-blue-500"> {userLikes ? userLikes.length : 0} </a>
    </div>
    <div className="p-3">
      {userLikes?.map((item) => (
        <div
          className="flex items-center space-x-4 rounded-md -mx-2 p-2 hover:bg-gray-50"
          key={item._id}
        >
          <a className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-full relative">
            <img
              src={item.profilePicture}
              className="absolute w-full h-full inset-0 "
              alt=""
            />
          </a>
          <div className="flex-1">
            <a className="text-base font-semibold capitalize">{item.name}</a>
            <div className="text-sm text-gray-500 mt-0.5">{item.email}</div>
          </div>
          <a className="flex items-center justify-center h-8 px-3 rounded-md text-sm border font-semibold">
            Follow
          </a>
        </div>
      ))}
    </div>
    <a
      className="border-t block text-center py-2 poiter"
      onClick={nextpageLikedW}
    >
      ver más
    </a>
  </ModalSimple>
</>;
