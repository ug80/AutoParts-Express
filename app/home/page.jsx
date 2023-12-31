"use client";

import { useEffect, useState } from "react";
// import { MoonLoader } from "react-spinners";
import Link from "next/link";
import { useSession } from "next-auth/react";
import AddToCartButton from "./addToCartButton";
//import AddToCart from "./addToCart"
//import DeleteToCart from "./deleteToCart"
import { useCart } from "../hooks/useCart";

const Home = () => {
  const { data: session } = useSession();
  const { cart, addToCart, removeFromCart } = useCart();

  const [mustBeLogged, setMustBeLogged] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [idClient, setIdClient] = useState("");

  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [productsSupport, setProductsSupport] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    brand: "",
    model: "",
    rating: 0,
  });
  const [ascendingOrder, setAscendingOrder] = useState(true);
  const [priceRange, setPriceRange] = useState("");
  const [addtocart, setAddtocart] = useState(false);

  function handleProduct(event) {
    event.preventDefault();
    setPage(1);
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  }

  function handlePriceRange(event) {
    setPage(1);
    const { value } = event.target;
    setPriceRange(value);
  }

  function toggleOrder(orderType) {
    if (orderType === "menorPrecio") {
      setAscendingOrder(true);
    } else if (orderType === "mayorPrecio") {
      setAscendingOrder(false);
    }
  }

  function handleAddToCart(idClient, idProduct, mustBeLogged, inTheCart) {
    if (!mustBeLogged) {
      if (!inTheCart) {
        fetch(`/cart/api`, {
          method: "POST",
          body: JSON.stringify({
            idClient,
            idProduct,
          }),
        })
          .then((r) => r.json())
          .catch(() => console.log(error));
      } else {
        fetch(`/home/api?idClient=${idClient}&idProduct=${idProduct}`)
          .then((r) => r.json())
          .then((r) => {
            fetch(`/cart/api?id=${r[r.length - 1]?.id}`, {
              method: "DELETE",
            }).catch(() => console.log(error));
          });
      }
    } else {
      alert("para persistir en la compra deberia estar logeado");
    }
  }

  const uniqueBrands = Array.from(
    new Set(productsSupport.map((product) => product.brand))
  );

  const uniqueModels = Array.from(
    new Set(productsSupport.map((product) => product.model))
  );

  useEffect(() => {
    setIsLoading(true);
    if (localStorage.getItem("email")) {
      fetch(
        `/client/form/login/api/email?email=${localStorage.getItem("email")}`
      )
        .then((r) => r.json())
        .then((r) => {
          setIdClient(r.client[0]?.id);
          return r;
        })
        .then((r) => {
          setMustBeLogged(false);
          return r;
        })
        .then((r) => {
          fetch(`/dashboard/products/api?idClient=${r.client[0].id}`)
            .then((r) => r.json())
            .then((r) => r.products)
            .then((r) => {
              setProducts(r);
              setProductsSupport(r);
              setIsLoading(false);
            })
            .catch(() => {
              setIsLoading(false);
              setError("Failed to load");
            });
        });
    } else if (session) {
      fetch(`/client/form/login/api/email?email=${session.user.email}`)
        .then((r) => r.json())
        .then((r) => {
          setIdClient(r.client[0].id);
          return r;
        })
        .then((r) => {
          setMustBeLogged(false);
          return r;
        })
        .then((r) => {
          // fetch("/dashboard/products/api")
          fetch(`/dashboard/products/api?idClient=${r.client[0].id}`)
            .then((r) => r.json())
            .then((r) => r.products)
            .then((r) => {
              setProducts(r);
              setProductsSupport(r);
              setIsLoading(false);
            })
            .catch(() => {
              setIsLoading(false);
              setError("Failed to load");
            });
        });
    } else {
      fetch("/dashboard/products/api")
        .then((r) => r.json())
        .then((r) => r.products)
        .then((r) => {
          setProducts(r);
          setProductsSupport(r);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          setError("Failed to load");
        });
    }
  }, [session?.user.email]);

  useEffect(() => {
    setAddtocart(false);
  }, [page]);
  if (isLoading)
    return (
      <div className="flex animate-pulse">
        <div className=" flex flex-col gap-9 mt-16  ml-7 w-1/4">
          <div className=" h-16 bg-slate-400/70 rounded-lg col-span-full"></div>
          <div className=" h-16 bg-slate-400/70 rounded-lg col-span-full"></div>
          <div className=" h-16 bg-slate-400/70 rounded-lg col-span-full"></div>
          <div className=" h-16 bg-slate-400/70 rounded-lg col-span-full"></div>
          <div className=" h-16 bg-slate-400/70 rounded-lg col-span-full"></div>
          <div className=" h-16 bg-slate-400/70 rounded-lg col-span-full"></div>
          <div className=" h-16 bg-slate-400/70 rounded-lg col-span-full"></div>
        </div>

        <div className=" mt-14 ml-14 w-full">
          <div className=" flex gap-3 w-fit mx-auto mb-12">
            <div className=" h-11 bg-slate-400/70 rounded-lg col-span-full w-20 mx-auto"></div>
            <div className=" h-11 bg-slate-400/70 rounded-lg col-span-full w-20 mx-auto"></div>
            <div className=" h-11 bg-slate-400/70 rounded-lg col-span-full w-20 mx-auto"></div>
          </div>

          <div className=" flex w-full justify-between  flex-wrap gap-y-9">
            <div className=" bg-slate-300/90 p-11 pb-8 rounded-2xl h-fit">
              <div className=" h-60 bg-slate-400/70 w-52 rounded-lg"></div>
              <div className=" flex justify-between">
                <span className=" h-11 bg-slate-400/70 w-24 rounded-lg mt-4"></span>
                <span className=" h-11 bg-slate-400/70 w-24 rounded-lg mt-4"></span>
              </div>
            </div>
            <div className=" bg-slate-300/90 p-11 pb-8 rounded-2xl h-fit">
              <div className=" h-60 bg-slate-400/70 w-52 rounded-lg"></div>
              <div className=" flex justify-between">
                <span className=" h-11 bg-slate-400/70 w-24 rounded-lg mt-4"></span>
                <span className=" h-11 bg-slate-400/70 w-24 rounded-lg mt-4"></span>
              </div>
            </div>
            <div className=" bg-slate-300/90 p-11 pb-8 rounded-2xl h-fit">
              <div className=" h-60 bg-slate-400/70 w-52 rounded-lg"></div>
              <div className=" flex justify-between">
                <span className=" h-11 bg-slate-400/70 w-24 rounded-lg mt-4"></span>
                <span className=" h-11 bg-slate-400/70 w-24 rounded-lg mt-4"></span>
              </div>
            </div>
            <div className=" bg-slate-300/90 p-11 pb-8 rounded-2xl h-fit">
              <div className=" h-60 bg-slate-400/70 w-52 rounded-lg"></div>
              <div className=" flex justify-between">
                <span className=" h-11 bg-slate-400/70 w-24 rounded-lg mt-4"></span>
                <span className=" h-11 bg-slate-400/70 w-24 rounded-lg mt-4"></span>
              </div>
            </div>
            <div className=" bg-slate-300/90 p-11 pb-8 rounded-2xl h-fit">
              <div className=" h-60 bg-slate-400/70 w-52 rounded-lg"></div>
              <div className=" flex justify-between">
                <span className=" h-11 bg-slate-400/70 w-24 rounded-lg mt-4"></span>
                <span className=" h-11 bg-slate-400/70 w-24 rounded-lg mt-4"></span>
              </div>
            </div>
            <div className=" bg-slate-300/90 p-11 pb-8 rounded-2xl h-fit">
              <div className=" h-60 bg-slate-400/70 w-52 rounded-lg"></div>
              <div className=" flex justify-between">
                <span className=" h-11 bg-slate-400/70 w-24 rounded-lg mt-4"></span>
                <span className=" h-11 bg-slate-400/70 w-24 rounded-lg mt-4"></span>
              </div>
            </div>
            <div className=" bg-slate-300/90 p-11 pb-8 rounded-2xl h-fit">
              <div className=" h-60 bg-slate-400/70 w-52 rounded-lg"></div>
              <div className=" flex justify-between">
                <span className=" h-11 bg-slate-400/70 w-24 rounded-lg mt-4"></span>
                <span className=" h-11 bg-slate-400/70 w-24 rounded-lg mt-4"></span>
              </div>
            </div>
            <div className=" bg-slate-300/90 p-11 pb-8 rounded-2xl h-fit">
              <div className=" h-60 bg-slate-400/70 w-52 rounded-lg"></div>
              <div className=" flex justify-between">
                <span className=" h-11 bg-slate-400/70 w-24 rounded-lg mt-4"></span>
                <span className=" h-11 bg-slate-400/70 w-24 rounded-lg mt-4"></span>
              </div>
            </div>
            <div className=" bg-slate-300/90 p-11 pb-8 rounded-2xl h-fit">
              <div className=" h-60 bg-slate-400/70 w-52 rounded-lg"></div>
              <div className=" flex justify-between">
                <span className=" h-11 bg-slate-400/70 w-24 rounded-lg mt-4"></span>
                <span className=" h-11 bg-slate-400/70 w-24 rounded-lg mt-4"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  if (error) return <div>{error}</div>;

  const filteredProducts = productsSupport
    .filter((product) =>
      product.brand?.toLowerCase().includes(filters.brand.toLowerCase())
    )
    .filter((product) =>
      product.model?.toLowerCase().includes(filters.model.toLowerCase())
    )
    .filter((product) =>
      product.name?.toLowerCase().includes(filters.name.toLowerCase())
    )
    .filter(
      (product) => filters.rating === 0 || product.rating === filters.rating
    )
    .filter((product) => {
      if (priceRange === "hasta75") {
        return product.price <= 75;
      } else if (priceRange === "75a150") {
        return product.price > 75 && product.price <= 150;
      } else if (priceRange === "masde150") {
        return product.price > 150;
      } else {
        return true;
      }
    });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const orderFactor = ascendingOrder ? 1 : -1;
    return orderFactor * (a.price - b.price);
  });

  const productsPerPage = 6;
  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const displayedProducts = sortedProducts.slice(startIndex, endIndex);

  const checkProductInCart = (product) => {
    //if(product.Cart.length !== 0 ) addToCart(product);
    //console.log("ver", [product.Cart, product.Cart.length]);
    if (product.Cart.length == 1 && !addtocart) {
      addToCart(product);
      setAddtocart(true);
    }
    return cart.some((item) => item.id === product.id);
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <div className="w-full sm:w-1/5 p-4">
        <header className="p-4 rounded-lg">
          <div className="mb-4 my-6">
            <label
              className="mx-1.5 text-gray-800 font-semibold"
              htmlFor="name"
            >
              Nombre
            </label>
            <input
              type="text"
              name="name"
              onChange={handleProduct}
              value={filters.name}
              placeholder="Buscar"
              className="w-full border-2 bg-white border-blue-Nav p-4 bg-transparent"
            />
          </div>
          <div className="mb-4">
            <label
              className="mx-1.5 text-gray-800 font-semibold"
              htmlFor="brand"
            >
              Marca
            </label>
            <select
              name="brand"
              onChange={handleProduct}
              value={filters.brand}
              className="w-full border-2 bg-white border-blue-Nav p-4 bg-transparent"
            >
              <option value="">Todas las marcas</option>
              {uniqueBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              className="mx-1.5 text-gray-800 font-semibold"
              htmlFor="model"
            >
              Modelo
            </label>
            <select
              name="model"
              onChange={handleProduct}
              value={filters.model}
              className="w-full border-2 bg-white border-blue-Nav p-4 bg-transparent"
            >
              <option value="">Todos los modelos</option>
              {uniqueModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
          {/* <div className="mb-4"> */}
           {/*  <label
              className="mx-1.5 text-gray-800 font-semibold"
              htmlFor="rating"
            >
              Rating
            </label> */}
            {/* <select
              name="rating"
              onChange={handleProduct}
              value={filters.rating}
              className="w-full border-2 bg-white border-blue-Nav p-4 bg-transparent"
            >
              <option value="0">Cualquier rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select> */}
          {/* </div> */}
          <div className="mb-4">
            <label
              className="mx-1.5 text-gray-800 font-semibold"
              htmlFor="priceRange"
            >
              Precio
            </label>
            <select
              name="priceRange"
              onChange={handlePriceRange}
              value={priceRange}
              className="w-full border-2 bg-white border-blue-Nav p-4 bg-transparent"
            >
              <option value="">Cualquier precio</option>
              <option value="hasta75">Hasta $75</option>
              <option value="75a150">$75 - $150</option>
              <option value="masde150">Más de $150</option>
            </select>
          </div>
          <button
            className="w-full bg-blue-Nav hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4"
            onClick={() => {
              setProducts(productsSupport);
              setFilters({
                name: "",
                brand: "",
                model: "",
                rating: 0,
              });
              setPriceRange("");
            }}
          >
            Reiniciar
          </button>
        </header>
      </div>
      <div className="w-full sm:w-3/4">
        <div className="text-right mt-4">
          <span className="text-gray-800 font-semibold">Ordenar por: </span>
          <button
            className="bg-blue-Nav text-white font-bold py-1 px-4 rounded my-4 mr-2"
            onClick={() => toggleOrder("menorPrecio")}
          >
            Menor precio
          </button>
          <button
            className="bg-blue-Nav text-white font-bold py-1 px-4 rounded my-4 sm:mr-0"
            onClick={() => toggleOrder("mayorPrecio")}
          >
            Mayor precio
          </button>
        </div>

        <div>
          {displayedProducts.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {displayedProducts
                .filter((value) => value.availability > 0 && value.status)
                .map((value, index) => (
                  <div key={index} className="max-w-lg">
                    <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-lg dark:bg-gray-800 dark:border-gray-700 flex flex-col h-full">
                      <img
                        className="w-full h-52 rounded-t-lg object-center object-contain max-h-full"
                        src={value.image}
                        alt=""
                      />
                      <div className="p-5 flex flex-col justify-between h-full">
                        <div className="border-b border-gray-300 mb-1"></div>
                        <p className="font-normal text-gray-700 mb-1 dark:text-gray-400">
                          {value.brand}
                        </p>
                        <h5 className="text-blue-Nav font-bold text-3xl tracking-tight mb-1">
                          {value.name}
                        </h5>
                        <p className="font-normal text-gray-700 mb-1 dark:text-gray-400">
                          {value.model}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-blue-Nav text-2xl px-0 py-2">
                            ${value.price}
                          </p>
                          {/* <p className="font-normal text-gray-700 text-right px-1">
                            Rating: {value.rating}
                          </p> */}
                        </div>
                        <div className="flex items-center justify-between">
                          <button className="bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-12 py-2.5 text-center">
                            <Link href={`/detail/${value.id}`}>Ver</Link>
                          </button>
                          <div>
                            {/* adiero o quito del carrito */}
                            {checkProductInCart(value) ? (
                              <div className="flex items-center justify-between">
                                <button
                                  className=" text-yellow-600 border-2 border-yellow-300 hover:bg-yellow-300 hover:text-white font-medium rounded-lg text-sm px-4 py-2.5 text-center"
                                  onClick={() => {
                                    removeFromCart(value);
                                    handleAddToCart(
                                      idClient,
                                      value.id,
                                      mustBeLogged,
                                      checkProductInCart(value)
                                    );
                                  }}
                                >
                                  Quitar del carrito
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <button
                                  className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300  font-medium rounded-lg text-sm px-4 py-2.5 text-center"
                                  onClick={() => {
                                    addToCart(value);
                                    handleAddToCart(
                                      idClient,
                                      value.id,
                                      mustBeLogged,
                                      checkProductInCart(value)
                                    );
                                  }}
                                >
                                  Añadir al carrito
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <section className="text-gray-600 body-font">
              <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-col text-center w-full mb-12">
                  <p className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
                    Lo sentimos. No contamos con el producto solicitado en este
                    momento
                  </p>
                  <p className="lg:w-2/3 mx-auto leading-relaxed text-base"></p>
                </div>
              </div>
            </section>
          )}
        </div>
        <header className="flex gap-4 justify-center items-center mt-4">
          <button
            className="bg-red-botton text-white font-bold py-1 px-4 rounded my-4"
            onClick={() => {
              if (page > 1) setPage(page - 1);
            }}
          >
            Anterior
          </button>
          <span className="text-3xl font-bold">
            {page}/{Math.ceil(sortedProducts.length / productsPerPage)}
          </span>
          <button
            className="bg-red-botton text-white font-bold py-1 px-4 rounded my-4"
            onClick={() => {
              if (page < Math.ceil(sortedProducts.length / productsPerPage)) {
                setPage(page + 1);
              }
            }}
          >
            Siguiente
          </button>
        </header>
      </div>
    </div>
  );
};

export default Home;
