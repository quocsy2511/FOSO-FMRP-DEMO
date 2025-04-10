import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import TagBranch from "@/components/UI/common/Tag/TagBranch";
import Loading from "@/components/UI/loading/loading";
import NoData from "@/components/UI/noData/nodata";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import { optionsQuery } from "@/configs/optionsQuery";
import {
    CONFIRM_DELETION,
    TITLE_DELETE_PRODUCTIONS_ORDER,
} from "@/constants/delete/deleteTable";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { useBranchList } from "@/hooks/common/useBranch";
import { useInternalPlansSearchCombobox } from "@/hooks/common/useInternalPlans";
import { useItemsVariantSearchCombobox } from "@/hooks/common/useItems";
import { useOrdersSearchCombobox } from "@/hooks/common/useOrder";
import { useToggle } from "@/hooks/useToggle";
import { formatMoment } from "@/utils/helpers/formatMoment";
import { debounce } from "lodash";
import dynamic from "next/dynamic";
import React, {
    memo,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { v4 as uddid } from "uuid";
import { ProductionsOrdersContext } from "../../context/productionsOrders";
import { useProductionOrdersCombobox } from "../../hooks/useProductionOrdersCombobox";
import { useProductionOrdersComboboxDetail } from "../../hooks/useProductionOrdersComboboxDetail";
import FilterHeader from "../header/filterHeader";
import ModalDetail from "../modal/modalDetail";
import PopupConfimStage from "../popup/PopupConfimStage";
import { RiDeleteBin5Line } from "react-icons/ri";
import useToast from "@/hooks/useToast";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import Zoom from "@/components/UI/zoomElement/zoomElement";
import PopupRecallRawMaterials from "../popup/PopupRecallRawMaterials";
import { useSelector } from "react-redux";
import FunnelIcon from "@/components/icons/common/FunnelIcon";
import CaretDownIcon from "@/components/icons/common/CaretDownIcon";
import ButtonAnimationNew from "@/components/common/button/ButtonAnimationNew";
import FilterDropdown from "@/components/common/dropdown/FilterDropdown";

import DatePicker from "react-datepicker";
import MagnifyingGlassIcon from "@/components/icons/common/MagnifyingGlassIcon";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

// const PopupConfimStage = dynamic(() => import("../popup/PopupConfimStage"), { ssr: false });
import MultiValue from "@/components/UI/mutiValue/multiValue";
import RadioDropdown from "@/components/common/dropdown/RadioDropdown";
import SelectComponentNew from "@/components/common/select/SelectComponentNew";
import { ContainerFilterTab } from "@/components/UI/common/layout";
import { useAutoActiveTabWithUnderline } from "@/hooks/custom/tab/useAutoActiveTabWithUnderline";
import TabSwitcherWithUnderline from "@/components/common/tab/TabSwitcherWithUnderline";
import CalendarBlankIcon from "@/components/icons/common/CalendarBlankIcon";
import ChartDonutIcon from "@/components/icons/common/ChartDonutIcon";
import CheckIcon from "@/components/icons/common/CheckIcon";
import StatusCheckboxGroup from "@/components/common/checkbox/StatusCheckboxGroup";
import useStatusExprired from "@/hooks/useStatusExprired";

import BreadcrumbCustom from "@/components/UI/breadcrumb/BreadcrumbCustom";
import { useProductionOrdersList } from "@/managers/api/productions-order/useProductionOrdersList";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import LimitListDropdown from "@/components/common/dropdown/LimitListDropdown";
import LoadingComponent from "@/components/common/loading/loading/LoadingComponent";
import { useInView } from "react-intersection-observer";
import { useProductionOrderDetail } from "@/managers/api/productions-order/useProductionOrderDetail";
import PrinterIcon from "@/components/icons/common/PrinterIcon";
import StickerIcon from "@/components/icons/common/StickerIcon";
import ArrowCounterClockwiseIcon from "@/components/icons/common/ArrowCounterClockwiseIcon";
import TrashIcon from "@/components/icons/common/TrashIcon";
import { FaCheck } from "react-icons/fa";
import ListChecksIcon from "@/components/icons/common/ListChecksIcon";
import KanbanIcon from "@/components/icons/common/KanbanIcon";
import Image from "next/image";
import CaretDropdownThinIcon from "@/components/icons/common/CaretDropdownThinIcon";
import CheckThinIcon from "@/components/icons/common/CheckThinIcon";
import { useSheet } from "@/context/ui/SheetContext";
import SheetProductionsOrderDetail from "../sheet/SheetProductionsOrderDetail";
import DetailProductionOrderList from "../ui/DetailProductionOrderList";
import { StateContext } from "@/context/_state/productions-orders/StateContext";
import { CookieCore } from "@/utils/lib/cookie";
import PopupRequestUpdateVersion from "@/components/common/popup/PopupRequestUpdateVersion";
import { useDispatch } from "react-redux";
import PopupQRCode from "../popup/PopupQRCode";
import { useQRCodProductCompleted } from "@/managers/api/productions-order/useQR";
import apiProducts from "@/Api/apiProducts/products/apiProducts";
import {
    fetchPDFManufactures,
    fetchPDFPlanManufactures,
} from "@/managers/api/productions-order/useLinkFilePDF";
import TabSemi from "../table/tabSemi";
import PlaningProductionOrder from "../ui/PlaningProductionOrder";
import useSetingServer from "@/hooks/useConfigNumber";
import PopupUpdateNewVersion from "@/components/common/popup/PopupUpdateNewVersion";
import { useVersionApplication } from "@/managers/api/version-application/useVersionApplication";

const ProductionsOrderMain = ({ dataLang, typeScreen }) => {
    const statusExprired = useStatusExprired();

    const dispatch = useDispatch();

    const breadcrumbItems = [
        {
            label: `${dataLang?.materials_planning_manufacture ||
                "materials_planning_manufacture"
                }`,
            href: "/",
        },
        {
            label: `${dataLang?.productions_orders || "productions_orders"}`,
        },
    ];

    const listTab = [
        {
            id: uddid(),
            name: dataLang?.import_finished_product || "import_finished_product",
            type: "products",
        },
        {
            id: uddid(),
            name: dataLang?.materials_planning_semi || "materials_planning_semi",
            type: "semiProduct",
        },
    ];

    const listLsxTab = [
        {
            id: "2323",
            name: "Thông tin",
            count: null,
            type: "products",
        },
        {
            id: "43434",
            name: "Kế hoạch BTP & NVL",
            count: 0,
            type: "semiProduct",
        },
    ];

    const listLsxStatus = [
        {
            label: "Chưa sản xuất",
            value: "0",
            color: "bg-[#FF811A]/15 text-[#C25705]",
        },
        {
            label: "Đang sản xuất",
            value: "1",
            color: "bg-[#3ECeF7]/20 text-[#076A94]",
        },
        {
            label: "Hoàn thành",
            value: "2",
            color: "bg-[#35BD4B]/20 text-[#1A7526]",
        },
    ];

    const listDropdownCompleteStage = [
        {
            id: 1,
            label: "Tổng toàn lệnh",
            icon: <ListChecksIcon className="size-full" />, // bạn thay bằng icon tương ứng
            isPremium: false,
            type: "normal",
        },
        {
            id: 2,
            label: "Chi tiết công đoạn",
            icon: <KanbanIcon className="size-full" />,
            isPremium: true,
            type: "complete_stage",
        },
    ];

    const router = useRouter();
    const { ref: refInviewListLsx, inView: inViewListLsx } = useInView();
    const dataSeting = useSetingServer();

    const typePageMoblie = typeScreen == "mobile";

    const isShow = useToast();

    const { data: listBr = [] } = useBranchList();

    const breadcrumbRef = useRef(null);
    const titleRef = useRef(null);
    const filterRef = useRef(null);
    const paginationRef = useRef(null);
    const groupButtonRef = useRef(null);

    const isInitialRun = useRef(true);

    const [isOpenSearch, setIsOpenSearch] = useState(false);

    const { isOpen: isOpenSheet, openSheet, closeSheet, sheetData } = useSheet();
    const { isOpen, handleQueryId, isIdChild, isId } = useToggle();

    // const { isStateProvider: isStateProvider?.productionsOrders, queryStateProvider } = useContext(ProductionsOrdersContext);
    const { isStateProvider, queryStateProvider } = useContext(StateContext);

    const params = useMemo(
        () => ({
            branch_id: isStateProvider?.productionsOrders.valueBr?.value || "",
            _po_id:
                isStateProvider?.productionsOrders.valueProductionOrders?.value || "",
            search:
                isStateProvider?.productionsOrders.search == ""
                    ? ""
                    : isStateProvider?.productionsOrders.search,
            _pod_id:
                isStateProvider?.productionsOrders.valueProductionOrdersDetail?.value ||
                "",
            orders_id:
                [isStateProvider?.productionsOrders.valueOrders?.value]?.length > 0
                    ? [isStateProvider?.productionsOrders.valueOrders?.value].map(
                        (e) => e
                    )
                    : "",
            date_end: isStateProvider?.productionsOrders.date.dateEnd
                ? formatMoment(
                    isStateProvider?.productionsOrders.date.dateEnd,
                    FORMAT_MOMENT.DATE_SLASH_LONG
                )
                : "",
            internal_plans_id:
                [isStateProvider?.productionsOrders.valuePlan?.value]?.length > 0
                    ? [isStateProvider?.productionsOrders.valuePlan?.value].map((e) => e)
                    : "",
            date_start: isStateProvider?.productionsOrders.date.dateStart
                ? formatMoment(
                    isStateProvider?.productionsOrders.date.dateStart,
                    FORMAT_MOMENT.DATE_SLASH_LONG
                )
                : "",
            item_variation_id:
                isStateProvider?.productionsOrders.valueProducts?.length > 0
                    ? isStateProvider?.productionsOrders.valueProducts.map(
                        (e) => e?.e?.item_variation_id
                    )
                    : null,
            ...(isStateProvider?.productionsOrders?.selectStatusFilter?.length >
                0 && { status: isStateProvider?.productionsOrders.selectStatusFilter }),
        }),
        [isStateProvider]
    );

    const { data: listOrders = [] } = useOrdersSearchCombobox(
        isStateProvider?.productionsOrders.searchOrders
    );
    const { data: listPlan = [] } = useInternalPlansSearchCombobox(
        isStateProvider?.productionsOrders.searchPlan
    );
    const { data: comboboxProductionOrdersDetail = [] } =
        useProductionOrdersComboboxDetail(
            isStateProvider?.productionsOrders.searchPODetail
        );
    const { data: listProducts = [] } = useItemsVariantSearchCombobox(
        isStateProvider?.productionsOrders.searchItemsVariant
    );
    const { data: comboboxProductionOrders = [] } = useProductionOrdersCombobox(
        isStateProvider?.productionsOrders.searchProductionOrders
    );
    //lấy mã QR code để nhảy qua app  ở button tổng lệnh sản xuất
    // const { data: QRCode } = useQRCodProductCompleted(
    //     isStateProvider?.productionsOrders.idDetailProductionOrder
    // );
    //lấy link print lệnh sản xuất

    // call api list production
    const {
        data: dataProductionOrders,
        isLoading: isLoadingProductionOrderList,
        isFetching: isFetchingProductionOrderList,
        fetchNextPage: fetchNextPageProductionOrderList,
        hasNextPage: hasNextPageProductionOrderList,
        refetch: refetchProductionOrderList,
        isRefetching: isRefetchingProductionOrderList,
    } = useProductionOrdersList(params);

    // call api detail production
    const {
        data: dataProductionOrderDetail,
        isLoading: isLoadingProductionOrderDetail,
        refetch: refetchProductionOrderDetail,
        isRefetching: isRefetchingProductionOrderDetail,
    } = useProductionOrderDetail({
        id: isStateProvider?.productionsOrders?.idDetailProductionOrder,
        enabled: !!isStateProvider?.productionsOrders?.idDetailProductionOrder,
    });

    // const handleFilter = (type, value) => queryStateProvider({
    //     productionsOrders: {
    //         ...isStateProvider?.productionsOrders,
    //         [type]: value, page: 1
    //     }
    // });

    const handleFilter = (type, value) => {
        if (isStateProvider?.productionsOrders?.[type] === value) return; // không update nếu không thay đổi

        queryStateProvider({
            productionsOrders: {
                ...isStateProvider?.productionsOrders,
                [type]: value,
                page: 1,
            },
        });
    };

    const stateFilterDropdown = useSelector((state) => state.stateFilterDropdown);

    // flag của list production
    const flagProductionOrders = useMemo(
        () =>
            dataProductionOrders
                ? dataProductionOrders?.pages?.flatMap((page) => page?.productionOrders)
                : [],
        [dataProductionOrders]
    );

    const poiId = router.query.poi_id;

    useEffect(() => {
        if (!router.isReady) return;

        const isOnProductionOrdersPage =
            router.pathname === "/manufacture/productions-orders";

        // Đóng Sheet nếu không còn ở đúng trang
        if (!isOnProductionOrdersPage) {
            closeSheet();
        }

        // Nếu có poi_id → set vào state
        if (poiId && isOnProductionOrdersPage) {
            queryStateProvider({
                productionsOrders: {
                    ...isStateProvider?.productionsOrders,
                    poiId: poiId,
                },
            });
        } else {
            // Nếu không có poi_id → clear
            queryStateProvider({
                productionsOrders: {
                    ...isStateProvider?.productionsOrders,
                    poiId: undefined,
                },
            });
        }
    }, [router.isReady, router.pathname, router.query]);

    // useEffect(() => {
    //     if (!poiId) {
    //         closeSheet(false);
    //         return;
    //     }

    //     //   Chờ có data thì mới mở sheet
    //     if (dataProductionOrderDetail) {
    //         openSheet({
    //             content: <SheetProductionsOrderDetail {...shareProps} />,
    //             className: 'w-[90vw] md:w-[700px] xl:w-[70%]',
    //         });
    //     }
    // }, [poiId, dataProductionOrderDetail]);

    // useEffect(() => {
    //     const cookieLsxActive = CookieCore.get("lsx_active") || "{}"
    //     const parseCookieLsxActive = JSON?.parse(cookieLsxActive)

    //     console.log('parseCookieLsxActive', parseCookieLsxActive);

    //     if (flagProductionOrders?.length > 0) {
    //         if (flagProductionOrders?.find((item) => item?.id === parseCookieLsxActive?.id)) {
    //             if (dataProductionOrderDetail?.listPOItems?.length > 0 && poiId) {
    //                 openSheet({
    //                     content: <SheetProductionsOrderDetail {...shareProps} />,
    //                     className: 'w-[90vw] md:w-[700px] xl:w-[70%]',
    //                 });
    //                 queryStateProvider({
    //                     productionsOrders: {
    //                         ...isStateProvider?.productionsOrders,
    //                         idDetailProductionOrder: parseCookieLsxActive?.id
    //                     }
    //                 })
    //             } else {
    //                 closeSheet(false);
    //                 queryStateProvider({
    //                     productionsOrders: {
    //                         ...isStateProvider?.productionsOrders,
    //                         idDetailProductionOrder: flagProductionOrders[0]?.id
    //                     }
    //                 })
    //                 return;
    //             }

    //             return
    //         }
    //         if (!isStateProvider?.productionsOrders?.idDetailProductionOrder) {
    //             closeSheet()

    //             queryStateProvider({
    //                 productionsOrders: {
    //                     ...isStateProvider?.productionsOrders,
    //                     idDetailProductionOrder: flagProductionOrders[0]?.id
    //                 }
    //             })
    //         }

    //         return
    //     }

    // }, [flagProductionOrders, dataProductionOrderDetail])

    // useEffect(() => {
    //     if (!isInitialRun.current) return;
    //     if (!flagProductionOrders?.length) return;

    //     isInitialRun.current = false; // Đánh dấu đã chạy lần đầu

    //     const cookieLsxActive = CookieCore.get("lsx_active") || "{}";
    //     const parseCookieLsxActive = JSON?.parse(cookieLsxActive);

    //     const foundFlag = flagProductionOrders.find((item) => item?.id === parseCookieLsxActive?.id);

    //     if (isStateProvider?.productionsOrders?.poiId && foundFlag) {
    //         queryStateProvider({
    //             productionsOrders: {
    //                 ...isStateProvider?.productionsOrders,
    //                 idDetailProductionOrder: parseCookieLsxActive?.id
    //             }
    //         });

    //         openSheet({
    //             content: <SheetProductionsOrderDetail {...shareProps} />,
    //             className: 'w-[90vw] md:w-[700px] xl:w-[70%]',
    //         });

    //     } else {
    //         queryStateProvider({
    //             productionsOrders: {
    //                 ...isStateProvider?.productionsOrders,
    //                 idDetailProductionOrder: flagProductionOrders[0]?.id
    //             }
    //         });

    //         closeSheet(false);
    //     }
    // }, [flagProductionOrders,dataProductionOrderDetail]);

    useEffect(() => {
        if (!isInitialRun.current || !router.isReady) return;
        if (!flagProductionOrders?.length) return;

        isInitialRun.current = false;

        const cookieLsxActive = CookieCore.get("lsx_active") || "{}";
        const parseCookieLsxActive = JSON?.parse(cookieLsxActive);
        const foundFlag = flagProductionOrders.find(
            (item) => item?.id === parseCookieLsxActive?.id
        );

        if (router.query?.poi_id && foundFlag) {
            // Có poi_id trên URL + có trong cookie
            queryStateProvider({
                productionsOrders: {
                    ...isStateProvider?.productionsOrders,
                    idDetailProductionOrder: parseCookieLsxActive?.id,
                    poiId: router.query.poi_id,
                },
            });

            openSheet({
                type: "manufacture-productions-orders",
                content: <SheetProductionsOrderDetail {...shareProps} />,
                className: "w-[90vw] md:w-[700px] xl:w-[70%] lg:w-[75%]",
            });
        } else {
            // Không có poi_id hoặc không tìm thấy trong cookie
            queryStateProvider({
                productionsOrders: {
                    ...isStateProvider?.productionsOrders,
                    idDetailProductionOrder: flagProductionOrders[0]?.id,
                    poiId: undefined,
                },
            });

            closeSheet("manufacture-productions-orders");
        }
    }, [flagProductionOrders, router.isReady]);

    // active tab info & tab kế hoạch
    useEffect(() => {
        if (
            listLsxTab?.length > 0 &&
            !isStateProvider?.productionsOrders?.isTabList
        ) {
            console.log("check");

            queryStateProvider({
                productionsOrders: {
                    ...isStateProvider?.productionsOrders,
                    isTabList: listLsxTab[0],
                },
            });
        }
    }, [listLsxTab]);

    // loadmore list LSX
    useEffect(() => {
        if (inViewListLsx && hasNextPageProductionOrderList) {
            fetchNextPageProductionOrderList();
        }
    }, [inViewListLsx, fetchNextPageProductionOrderList]);

    // set data vào state detail
    useEffect(() => {
        if (
            isStateProvider?.productionsOrders?.idDetailProductionOrder &&
            dataProductionOrderDetail
        ) {
            queryStateProvider({
                productionsOrders: {
                    ...isStateProvider?.productionsOrders,
                    dataProductionOrderDetail: {
                        ...dataProductionOrderDetail,
                        title: dataProductionOrderDetail?.productionOrder?.reference_no,
                        idCommand: dataProductionOrderDetail?.productionOrder?.branch_id,
                        statusManufacture:
                            dataProductionOrderDetail?.productionOrder?.status_manufacture,
                        listPOItems: dataProductionOrderDetail?.listPOItems?.map(
                            (e, index) => {
                                return {
                                    ...e,
                                    id: e?.object_id,
                                    title: e?.reference_no,
                                    showChild:
                                        dataProductionOrderDetail?.listPOItems?.length > 0 &&
                                            index == 0
                                            ? true
                                            : false,
                                    arrListData: e?.items_products?.map((i) => {
                                        return {
                                            ...i,
                                            id: i?.poi_id,
                                            image: i?.images ? i?.images : "/icon/noimagelogo.png",
                                            name: i?.item_name,
                                            itemVariation: i?.product_variation,
                                            code: i?.item_code,
                                            quantity: +i?.quantity,
                                            unit: i?.unit_name,
                                            processBar: i?.list_stages?.map((j) => {
                                                return {
                                                    ...j,
                                                    id: uddid(),
                                                    active: j?.active == "1",
                                                    date: j?.date_active,
                                                    title: j?.name_stage,
                                                };
                                            }),
                                            childProducts: i?.semi_products?.map((e) => {
                                                return {
                                                    ...e,
                                                    image: e?.images
                                                        ? e?.images
                                                        : "/icon/noimagelogo.png",
                                                };
                                            }),
                                        };
                                    }),
                                };
                            }
                        ),
                        listSemiItems: dataProductionOrderDetail?.listSemiItems?.map(
                            (e, index) => {
                                return {
                                    ...e,
                                    id: e?.object_id,
                                    title: e?.reference_no,
                                    showChild:
                                        dataProductionOrderDetail?.listSemiItems?.length > 0 &&
                                            index == 0
                                            ? true
                                            : false,
                                    arrListData: e?.semi_products?.map((i) => {
                                        return {
                                            ...i,
                                            id: uddid(),
                                            image: i?.images ? i?.images : "/icon/noimagelogo.png",
                                            name: i?.item_name,
                                            itemVariation: i?.product_variation,
                                            code: i?.item_code,
                                            quantity: +i?.quantity,
                                            unit: i?.unit_name,
                                            processBar: i?.list_stages?.map((j) => {
                                                return {
                                                    ...j,
                                                    id: uddid(),
                                                    active: j?.active == "1",
                                                    date: j?.date_active,
                                                    title: j?.name_stage,
                                                };
                                            }),
                                            childProducts: {
                                                ...i?.products_parent,
                                                image: i?.products_parent?.images
                                                    ? i?.products_parent?.images
                                                    : "/icon/noimagelogo.png",
                                            },
                                        };
                                    }),
                                };
                            }
                        ),
                    },
                },
            });
        } else {
            queryStateProvider({
                productionsOrders: {
                    ...isStateProvider?.productionsOrders,
                    dataProductionOrderDetail: undefined,
                },
            });
        }
    }, [
        isStateProvider?.productionsOrders?.idDetailProductionOrder,
        dataProductionOrderDetail,
    ]);

    // onchange search combobox new
    const handleSearchProductionOrders = debounce((value) => {
        try {
            queryStateProvider((prev) => ({
                productionsOrders: {
                    ...prev.productionsOrders,
                    searchProductionOrders: value,
                },
            }));
        } catch (error) { }
    }, 500);

    // onchange search combobox new
    const handleSearchDataItems = debounce((value) => {
        try {
            queryStateProvider((prev) => ({
                productionsOrders: {
                    ...prev.productionsOrders,
                    searchItemsVariant: value,
                },
            }));
        } catch (error) { }
    }, 500);

    // onchange search combobox new
    const handleSearchDataOrder = debounce((value) => {
        try {
            queryStateProvider((prev) => ({
                productionsOrders: {
                    ...prev.productionsOrders,
                    searchOrders: value,
                },
            }));
        } catch (error) { }
    }, 500);

    // onchange search combobox new
    const handleSearchDataPoDetail = debounce((value) => {
        try {
            queryStateProvider((prev) => ({
                productionsOrders: {
                    ...prev.productionsOrders,
                    searchPODetail: value,
                },
            }));
        } catch (error) { }
    }, 500);

    // onchange search combobox new
    const handleSearchDataPlan = debounce((value) => {
        try {
            queryStateProvider((prev) => ({
                productionsOrders: {
                    ...prev.productionsOrders,
                    searchPlan: value,
                },
            }));
        } catch (error) { }
    }, 500);

    // Hàm mở danh sách công đoạn khi click vào lệnh sản xuất
    const handleShowListDetail = (item) => {
        if (item.id === isStateProvider?.productionsOrders?.idDetailProductionOrder)
            return;

        queryStateProvider({
            productionsOrders: {
                ...isStateProvider?.productionsOrders,
                idDetailProductionOrder: item?.id,
            },
        });

        CookieCore.set("lsx_active", JSON.stringify(item), {
            expires: new Date(Date.now() + 86400 * 1000),
            sameSite: true,
        });

        closeSheet("manufacture-productions-orders");
        router.push("/manufacture/productions-orders");
    };

    // Hàm change tab
    const handleActiveTab = (e, type) => {
        if (type === "detail") {
            queryStateProvider({
                productionsOrders: {
                    ...isStateProvider?.productionsOrders,
                    isTab: e,
                },
            });
        } else if (type === "list") {
            queryStateProvider({
                productionsOrders: {
                    ...isStateProvider?.productionsOrders,
                    isTabList: e,
                },
            });
        }
    };

    const handleConfim = async () => {
        try {
            const res = await apiProductionsOrders.apiDeleteProductionOrders(isId);
            if (res?.isSuccess == 1) {
                fetchState("delete");
                isShow("success", `${dataLang[res?.message] || res?.message}`);
            } else {
                isShow("error", `${dataLang[res?.message] || res?.message}`);
            }
            handleQueryId({ status: false });
        } catch (error) { }
    };

    // Hàm mở accordion trong danh sách công đoạn
    const handleToggleAccordionList = (id, type) => {
        queryStateProvider({
            productionsOrders: {
                ...isStateProvider?.productionsOrders,
                dataProductionOrderDetail: {
                    ...isStateProvider?.productionsOrders.dataProductionOrderDetail,
                    [type]:
                        isStateProvider?.productionsOrders.dataProductionOrderDetail?.[
                            type
                        ]?.map((e) => {
                            if (e.id == id) {
                                return {
                                    ...e,
                                    showChild: !e.showChild,
                                };
                            }
                            return e;
                        }),
                },
            },
        });
    };

    // Search lệnh sản xuất có debounce
    const onChangeSearch = useMemo(
        () =>
            debounce((e) => {
                queryStateProvider({
                    productionsOrders: {
                        ...isStateProvider?.productionsOrders,
                        search: e.target.value,
                        page: 1,
                    },
                });
            }, 500),
        [isStateProvider]
    );

    // Hàm xóa chi tiết công đoạn
    const handDeleteItem = (id, type) => {
        queryStateProvider({
            productionsOrders: {
                ...isStateProvider?.productionsOrders,
                page: 1,
            },
        });
        handleQueryId({ status: true, id: id, idChild: type });
    };

    // Hàm mở Sheet chi tiết công đoạn
    const handleToggleSheetDetail = async (item) => {
        if (item.poi_id === isStateProvider?.productionsOrders?.poiId) return;

        // Cập nhật state trước để Sheet có đủ thông tin
        queryStateProvider({
            productionsOrders: {
                ...isStateProvider?.productionsOrders,
                itemDetailPoi: item,
            },
        });

        // Đợi router.push xong thì mới mở Sheet
        await router.push(
            {
                pathname: router.pathname,
                query: {
                    ...router.query,
                    poi_id: item.poi_id,
                },
            },
            undefined,
            { shallow: true }
        ); // tránh reload trang

        // Mở Sheet sau khi URL đã cập nhật
        openSheet({
            type: "manufacture-productions-orders",
            content: <SheetProductionsOrderDetail {...shareProps} />,
            className: "w-[90vw] md:w-[700px] xl:w-[70%] lg:w-[75%]",
        });

        // router.push({
        //     pathname: router.route,
        //     query: {
        //         ...router.query,
        //         poi_id: item.poi_id,
        //     },
        // });
    };

    const shareProps = {
        dataLang,
        handleToggleAccordionList,
        handDeleteItem,
        handleToggleSheetDetail,
        handleFilter,
        handleSearchProductionOrders,
        handleSearchDataOrder,
        handleSearchDataPlan,
        handleSearchDataItems,
        handleSearchDataPoDetail,
        listBr,
        listOrders,
        listPlan,
        listProducts,
        comboboxProductionOrders,
        comboboxProductionOrdersDetail,
        isLoadingProductionOrderDetail,
        refetchProductionOrderList,
        typePageMoblie,
    };

    // bộ lọc đang active
    const activeFilterCount = [
        isStateProvider?.productionsOrders.valueBr,
        isStateProvider?.productionsOrders.valueOrders,
        isStateProvider?.productionsOrders.valuePlan,
        isStateProvider?.productionsOrders.valueProductionOrders,
        isStateProvider?.productionsOrders.valueProductionOrdersDetail,
        isStateProvider?.productionsOrders.valueProducts || [],
    ].filter((item) => {
        if (Array.isArray(item)) return item.length > 0;
        return item !== null && item !== undefined;
    }).length;

    // trigger của bộ lọc tổng của tất cả
    const triggerFilterAll = (
        <button
            className={`${stateFilterDropdown?.open || activeFilterCount > 0
                ? "text-[#0F4F9E] border-[#3276FA] bg-[#EBF5FF]"
                : "bg-white text-[#9295A4] border-[#D0D5DD] hover:text-[#0F4F9E] hover:bg-[#EBF5FF] hover:border-[#3276FA]"
                } flex items-center space-x-2 border rounded-lg 3xl:h-10 h-9 px-3 group custom-transition`}
        >
            <span className="3xl:size-5 size-4 shrink-0">
                <FunnelIcon className="w-full h-full " />
            </span>
            <span
                className={`${stateFilterDropdown?.open || activeFilterCount > 0
                    ? "text-[#0F4F9E]"
                    : "text-[#3A3E4C] group-hover:text-[#0F4F9E]"
                    } text-nowrap 3xl:text-base text-sm custom-transition`}
            >
                {dataLang?.productions_orders_filter || "productions_orders_filter"}
            </span>
            {
                activeFilterCount > 0 && (
                    <span className="rounded-full bg-[#0F4F9E] text-white text-xs xl:size-5 size-4 flex items-center justify-center">
                        {activeFilterCount}
                    </span>
                )
                // :
                // <span className='xl:size-5 size-4' />
            }
            <span className="3xl:size-4 size-3.5 shrink-0">
                <CaretDownIcon
                    className={`${stateFilterDropdown?.open || activeFilterCount > 0
                        ? "rotate-180"
                        : "rotate-0"
                        } w-full h-full custom-transition`}
                />
            </span>
        </button>
    );

    // trigger của bộ lọc trạng thái
    const triggerFilterStatus = (
        <button
            className={`${stateFilterDropdown?.open ||
                isStateProvider?.productionsOrders?.selectStatusFilter?.length > 0
                ? "text-[#0F4F9E] border-[#3276FA] bg-[#EBF5FF]"
                : "bg-white text-[#9295A4] border-[#D0D5DD] hover:text-[#0F4F9E] hover:bg-[#EBF5FF] hover:border-[#3276FA]"
                } relative flex items-center justify-between 3xl:space-x-2 space-x-0 border rounded-lg 3xl:h-10 h-9 px-3 group custom-transition w-full`}
        >
            <ChartDonutIcon className="absolute -translate-y-1/2 top-1/2 3xl:size-5 size-4" />

            <span
                className={`${stateFilterDropdown?.open ||
                    isStateProvider?.productionsOrders?.selectStatusFilter?.length > 0
                    ? "text-[#0F4F9E]"
                    : "text-[#3A3E4C] group-hover:text-[#0F4F9E]"
                    } xl:pl-6 pl-4 text-nowrap 3xl:text-base text-sm custom-transition`}
            >
                {dataLang?.purchase_status || "purchase_status"}
            </span>

            <span className="3xl:size-4 size-3.5 shrink-0">
                <CaretDownIcon
                    className={`${stateFilterDropdown?.open ||
                        isStateProvider?.productionsOrders?.selectStatusFilter?.length > 0
                        ? "rotate-180"
                        : "rotate-0"
                        } w-full h-full custom-transition`}
                />
            </span>
        </button>
    );

    // trigger button hoàn thành công đoạn
    const triggerCompleteStage = (
        <div className="3xl:h-10 h-9 xl:px-4 px-2 flex items-center xl:gap-4 gap-2 xl:text-sm text-xs font-medium text-white border border-[#0375F3] bg-[#0375F3] hover:bg-[#0375F3] cursor-pointer hover:shadow-hover-button rounded-lg custom-transition">
            <span className="flex items-center gap-1 xl:gap-2">
                <span className="xl:size-4 size-3.5 shrink-0">
                    <CheckThinIcon className={`size-full`} />
                </span>

                <span>Hoàn thành sản xuất</span>
            </span>

            <span className="xl:size-4 size-3.5 shrink-0">
                <CaretDropdownThinIcon className={`size-full`} />
            </span>
        </div>
    );

    // toggle click vào ra ô search
    const toggleSearch = () => {
        setIsOpenSearch(!isOpenSearch);
    };

    // toggle chọn trạng thái lọc lệnh sản xuất
    const toggleStatus = (value) => {
        const currentSelected =
            isStateProvider?.productionsOrders.selectStatusFilter || [];

        const updatedSelected = currentSelected.includes(value)
            ? currentSelected.filter((v) => v !== value)
            : [...currentSelected, value];

        queryStateProvider({
            productionsOrders: {
                ...isStateProvider?.productionsOrders,
                selectStatusFilter: updatedSelected,
            },
        });
    };

    // tính toán chiều cao của các element
    const getElementHeightWithMargin = (el) => {
        if (!el) return 0;
        const style = window.getComputedStyle(el);
        const marginTop = parseFloat(style.marginTop) || 0;
        const marginBottom = parseFloat(style.marginBottom) || 0;
        const height = el.getBoundingClientRect().height || 0;
        return height + marginTop + marginBottom;
    };

    const calcAvailableHeight = (type) => {
        const breadcrumb = getElementHeightWithMargin(breadcrumbRef.current);
        const titleInfo = getElementHeightWithMargin(titleRef.current);
        const filter = getElementHeightWithMargin(filterRef.current);
        const pagination = getElementHeightWithMargin(paginationRef.current);
        const groupButton = getElementHeightWithMargin(groupButtonRef.current);

        if (type === "main") {
            return (
                window.innerHeight -
                breadcrumb -
                titleInfo -
                filter -
                pagination -
                84 -
                24
            );
        } else if (type === "submain") {
            return (
                window.innerHeight -
                breadcrumb -
                titleInfo -
                filter -
                groupButton -
                84 -
                34
            );
        }
    };

    const { data: version, isLoading: isLoadingVersion } = useVersionApplication()


    //phần dropdown hoàn thành công đoạn
    const handClickDropdownCompleteStage = (type) => {
        const currentPackage = dataSeting?.package;

        // xử lý button tổng toàn lệnh
        if (type === "normal") {
            dispatch({
                type: "statePopupGlobal",
                payload: {
                    open: true,
                    children: (
                        <PopupQRCode
                        // urlQR={QRCode?.data.qr}
                        />
                    ),
                },
            });
        }

        //xử lý button hoàn thành công đoạn  (đang điều kiện là gói user basic)
        if (type === "complete_stage" && currentPackage === "1") {
            dispatch({
                type: "statePopupGlobal",
                payload: {
                    open: true,
                    allowOutsideClick: false,
                    allowEscape: false,
                    children: (
                        // <PopupRequestUpdateVersion>
                        //     <p className="text-start xlg:text-2xl text-xl leading-[32px] font-semibold text-[#141522]">
                        //         Theo dõi chặt{" "}
                        //         <span className="text-[#0375F3]">
                        //             từng bước – từ bán thành phẩm
                        //         </span>{" "}
                        //         đến thành phẩm cuối cùng
                        //     </p>
                        // </PopupRequestUpdateVersion>
                        <>
                            {!isLoadingVersion && <>
                                <PopupUpdateNewVersion version={version} />
                            </>}
                        </>
                    ),
                },
            });

            return;
        }
    };

    const [loadingButton, setLoading] = useState(false);

    //phần in ra phiếu in lệnh sản xuất
    const handPrintManufacture = async (idManufacture) => {
        setLoading(true);
        try {
            const response = await fetchPDFManufactures({
                idManufacture: idManufacture,
            });

            if (response && typeof response === "string") {
                window.open(response, "_blank");
            }
            setLoading(false);
        } catch (error) {
            console.log("🚀 ~ handPrintManufacture ~ error:", error);
            setLoading(false);
        }
    };

    const handPrintPlanManufacture = async (idManufacture) => {
        setLoading(true);
        try {
            const response = await fetchPDFPlanManufactures({
                idManufacture: idManufacture,
            });
            if (response && typeof response === "string") {
                window.open(response, "_blank");
            }
            setLoading(false);
        } catch (error) {
            console.log("🚀 ~ handPrintManufacture ~ error:", error);
            setLoading(false);
        }
    };




    return (
        <React.Fragment>
            <div ref={breadcrumbRef}>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <React.Fragment>
                        <BreadcrumbCustom
                            items={breadcrumbItems}
                            className="3xl:text-sm 2xl:text-xs xl:text-[10px] lg:text-[10px]"
                        />
                    </React.Fragment>
                )}
            </div>

            <div ref={titleRef} className="flex items-center justify-between w-full">
                <h2 className="text-title-section text-[#52575E] capitalize font-medium">
                    {dataLang?.productions_orders || "productions_orders"}
                </h2>

                <div className="flex items-center gap-2 xl:max-w-[70%]">
                    <div className="relative flex items-center justify-end">
                        {/* Animated Search Input */}
                        <AnimatePresence>
                            {isOpenSearch && (
                                <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "100%", opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <form className="relative flex items-center w-full">
                                        <input
                                            onChange={(e) => onChangeSearch(e)}
                                            className={`
                                               ${isOpenSearch
                                                    ? "rounded-l-lg border-r-0 border-[#D0D5DD] focus:border-[#3276FA]"
                                                    : "rounded-lg border-[#D0D5DD]"
                                                }
                                                relative border  bg-white pl-2 3xl:h-10 h-9 text-base-default 3xl:w-[300px] w-[280px] focus:outline-none placeholder:text-[#3A3E4C] 3xl:placeholder:text-base placeholder:text-sm placeholder:font-normal`}
                                            type="text"
                                            // value={isStateProvider?.productionsOrders.search}
                                            placeholder={
                                                dataLang?.productions_orders_find ||
                                                "productions_orders_find"
                                            }
                                        />
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            layout
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <ButtonAnimationNew
                                icon={
                                    <div className="3xl:size-6 size-5">
                                        <MagnifyingGlassIcon className="size-full" />
                                    </div>
                                }
                                hideTitle={true}
                                className={`${isOpenSearch
                                    ? "rounded-r-lg bg-[#1760B9] text-white border-[#3276FA]"
                                    : "rounded-lg text-[#9295A4] border-[#D0D5DD]"
                                    } flex items-center justify-center 3xl:w-12 w-10 3xl:h-10 h-9 shrink-0 border`}
                                onClick={toggleSearch}
                            />
                        </motion.div>
                    </div>

                    <div className="relative">
                        <div className="3xl:size-5 size-4 absolute top-1/2 -translate-y-1/2 left-2 z-[2] pointer-events-none">
                            <CalendarBlankIcon className="size-full text-[#9295A4]" />
                        </div>

                        <DatePicker
                            id="start"
                            portalId="menu-time"
                            calendarClassName="rasta-stripes"
                            clearButtonClassName=""
                            selected={isStateProvider?.productionsOrders.date.dateStart}
                            startDate={isStateProvider?.productionsOrders.date.dateStart}
                            endDate={isStateProvider?.productionsOrders.date.dateEnd}
                            selectsRange
                            onChange={(date) => {
                                const [start, end] = date;
                                queryStateProvider({
                                    productionsOrders: {
                                        ...isStateProvider?.productionsOrders,
                                        date: {
                                            dateStart: start,
                                            dateEnd: end,
                                        },
                                    },
                                });
                            }}
                            isClearable
                            placeholderText={
                                `${dataLang?.productions_orders_select_day}` ||
                                "productions_orders_select_day"
                            }
                            className="pl-8 pr-2 3xl:h-10 h-9 text-base-default w-[250px] outline-none cursor-pointer focus:outline-none border-[#D0D5DD] focus:border-[#3276FA] focus:bg-[#EBF5FF] placeholder:text-[#3A3E4C] border rounded-md"
                            onKeyDown={(e) => e.preventDefault()} // 👈 chặn gõ bàn phím
                        />

                        {!isStateProvider?.productionsOrders.date.dateStart && (
                            <span className="absolute top-1/2 -translate-y-1/2 right-2 3xl:size-4 size-3.5 shrink-0 text-[#9295A4] pointer-events-none">
                                <CaretDownIcon className={`w-full h-full custom-transition`} />
                            </span>
                        )}
                    </div>

                    <FilterDropdown
                        trigger={triggerFilterAll}
                        style={{
                            boxShadow:
                                "0px 20px 24px -4px #10182814, 0px 4px 4px 0px #00000040",
                        }}
                        className="flex flex-col gap-4 border-[#D8DAE5] rounded-lg 3xl:!min-w-[1820px] 2xl:min-w-[1500px] xxl:min-w-[1400px] xl:min-w-[1250px] lg:min-w-[1000px]"
                        dropdownId="dropdownFilterMain"
                    >
                        <div className="3xl:text-xl text-lg text-[#344054] font-medium">
                            {dataLang?.productions_orders_filter ||
                                "productions_orders_filter"}
                        </div>

                        <div className="grid w-full grid-cols-4 gap-3 3xl:grid-cols-7">
                            <div className="col-span-1 space-y-1">
                                <h3 className="text-xs text-[#051B44] font-normal">
                                    {dataLang?.productions_orders_details_branch ||
                                        "productions_orders_details_branch"}
                                </h3>
                                <SelectComponentNew
                                    isClearable={true}
                                    value={isStateProvider?.productionsOrders.valueBr}
                                    onChange={(e) => handleFilter("valueBr", e)}
                                    options={listBr}
                                    classParent="ml-0 !font-semibold focus:ring-none focus:outline-none text-sm focus-visible:ring-none focus-visible:outline-none placeholder:text-sm placeholder:text-[#52575E]"
                                    classNamePrefix={"productionSmoothing"}
                                    placeholder={
                                        dataLang?.productions_orders_details_all ||
                                        "productions_orders_details_all"
                                    }
                                />
                            </div>

                            <div className="col-span-1 space-y-1">
                                <h3 className="text-xs text-[#051B44] font-normal">
                                    {dataLang?.productions_orders_sales_order ||
                                        "productions_orders_sales_order"}
                                    /
                                    {dataLang?.productions_orders_internal_plan ||
                                        "productions_orders_internal_plan"}
                                </h3>

                                <RadioDropdown />
                            </div>

                            <div className="col-span-1 space-y-1">
                                <h3 className="text-xs text-[#051B44] font-normal">
                                    {dataLang?.productions_orders_sales_order ||
                                        "productions_orders_sales_order"}
                                </h3>
                                <SelectComponentNew
                                    isClearable={true}
                                    value={isStateProvider?.productionsOrders.valueOrders}
                                    options={listOrders}
                                    onInputChange={(e) => {
                                        handleSearchDataOrder(e);
                                    }}
                                    classParent="ml-0 text-sm"
                                    onChange={(e) => handleFilter("valueOrders", e)}
                                    classNamePrefix={"productionSmoothing"}
                                    placeholder={
                                        dataLang?.productions_orders_sales_order ||
                                        "productions_orders_sales_order"
                                    }
                                    isDisabled={
                                        isStateProvider?.productionsOrders?.seletedRadioFilter
                                            ?.id !== 1
                                    }
                                />
                            </div>

                            <div className="col-span-1 space-y-1">
                                <h3 className="text-xs text-[#051B44] font-normal">
                                    {dataLang?.productions_orders_internal_plan ||
                                        "productions_orders_internal_plan"}
                                </h3>
                                <SelectComponentNew
                                    isClearable={true}
                                    value={isStateProvider?.productionsOrders.valuePlan}
                                    options={listPlan}
                                    onInputChange={(e) => {
                                        handleSearchDataPlan(e);
                                    }}
                                    classParent="ml-0 text-sm"
                                    onChange={(e) => handleFilter("valuePlan", e)}
                                    classNamePrefix={"productionSmoothing"}
                                    placeholder={
                                        dataLang?.productions_orders_internal_plan ||
                                        "productions_orders_internal_plan"
                                    }
                                    isDisabled={
                                        isStateProvider?.productionsOrders?.seletedRadioFilter
                                            ?.id !== 2
                                    }
                                />
                            </div>

                            <div className="col-span-1 space-y-1">
                                <h3 className="text-xs text-[#051B44] font-normal">
                                    {dataLang?.productions_orders_details_number ||
                                        "productions_orders_details_number"}
                                </h3>
                                <SelectComponentNew
                                    isClearable={true}
                                    value={
                                        isStateProvider?.productionsOrders.valueProductionOrders
                                    }
                                    onInputChange={(e) => {
                                        handleSearchProductionOrders(e);
                                    }}
                                    onChange={(e) => handleFilter("valueProductionOrders", e)}
                                    options={comboboxProductionOrders}
                                    classParent="ml-0 text-sm"
                                    classNamePrefix={"productionSmoothing"}
                                    placeholder={
                                        dataLang?.productions_orders_details_number ||
                                        "productions_orders_details_number"
                                    }
                                />
                            </div>

                            <div className="col-span-1 space-y-1">
                                <h3 className="text-xs text-[#051B44] font-normal">
                                    {dataLang?.productions_orders_details_lxs_number ||
                                        "productions_orders_details_lxs_number"}
                                </h3>
                                <SelectComponentNew
                                    isClearable={true}
                                    value={
                                        isStateProvider?.productionsOrders
                                            .valueProductionOrdersDetail
                                    }
                                    onInputChange={(e) => {
                                        handleSearchDataPoDetail(e);
                                    }}
                                    onChange={(e) =>
                                        handleFilter("valueProductionOrdersDetail", e)
                                    }
                                    options={comboboxProductionOrdersDetail}
                                    classParent="ml-0 text-sm"
                                    classNamePrefix={"productionSmoothing"}
                                    placeholder={
                                        dataLang?.productions_orders_details_lxs_number ||
                                        "productions_orders_details_lxs_number"
                                    }
                                />
                            </div>

                            <div className="col-span-2 space-y-1 3xl:col-span-1">
                                <h3 className="text-xs text-[#051B44] font-normal">
                                    {dataLang?.productions_orders_item ||
                                        "productions_orders_item"}
                                </h3>
                                <SelectComponentNew
                                    isClearable={true}
                                    value={isStateProvider?.productionsOrders.valueProducts}
                                    options={[
                                        { label: "Mặt hàng", value: "", isDisabled: true },
                                        ...listProducts,
                                    ]}
                                    onChange={(e) => handleFilter("valueProducts", e)}
                                    classParent="ml-0"
                                    classNamePrefix={"productionSmoothing"}
                                    placeholder={
                                        dataLang?.productions_orders_item ||
                                        "productions_orders_item"
                                    }
                                    onInputChange={(e) => {
                                        handleSearchDataItems(e);
                                    }}
                                    isMulti={true}
                                    components={{ MultiValue }}
                                    maxShowMuti={1}
                                    formatOptionLabel={(option) => {
                                        return (
                                            <div className="">
                                                {option?.isDisabled ? (
                                                    <div className="custom-text">
                                                        <h3 className="text-base font-medium bg-transparent">
                                                            {option.label}
                                                        </h3>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <div className="custom-none max-w-[30px] w-[30px] h-[30px] max-h-[30px]">
                                                            {option.e?.images != null ? (
                                                                <img
                                                                    src={option.e?.images}
                                                                    alt="Product Image"
                                                                    className="max-max-w-[30px] w-[30px] h-[30px] max-h-[30px] text-[8px] object-cover rounded"
                                                                />
                                                            ) : (
                                                                <div className=" max-w-[30px] w-[30px] h-[30px] max-h-[30px] object-cover  flex items-center justify-center rounded">
                                                                    <img
                                                                        src="/icon/noimagelogo.png"
                                                                        alt="Product Image"
                                                                        className="max-w-[30px] w-[30px] h-[30px] max-h-[30px] object-cover rounded"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="w-full custom-text">
                                                            <h3 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                                {option.e?.item_name}
                                                            </h3>
                                                            <h5 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] ">
                                                                {option.e?.product_variation}
                                                            </h5>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }}
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    styles={{
                                        multiValueLabel: (provided) => ({
                                            ...provided,
                                            "& .custom-none": {
                                                display: "none",
                                            },
                                            "& .custom-text": {
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "5px",
                                                maxWidth: "50px",
                                            },
                                            "& .custom-text h5": {
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            },
                                        }),

                                        menu: (provided) => ({
                                            ...provided,
                                            width: "125%",
                                            left: "auto",
                                            right: 0, // luôn mở rộng về phía trái từ góc phải của select
                                        }),
                                    }}
                                />
                            </div>
                        </div>
                    </FilterDropdown>
                </div>
            </div>

            <div ref={filterRef} className="flex items-center w-full gap-4 3xl:gap-6">
                <div className="w-full xl:max-w-[15%] max-w-[22%] shrink-0">
                    <FilterDropdown
                        trigger={triggerFilterStatus}
                        style={{
                            boxShadow:
                                "0px 20px 24px -4px #10182814, 0px 4px 4px 0px #00000040",
                        }}
                        className="flex flex-col gap-4 !p-0 border-[#D8DAE5] rounded-lg w-full shrink-0"
                        dropdownId="dropdownFilterStatus"
                        placement="bottom-left"
                    >
                        <StatusCheckboxGroup
                            list={listLsxStatus}
                            selected={isStateProvider?.productionsOrders.selectStatusFilter}
                            onChange={(value) => toggleStatus(value)}
                        />
                    </FilterDropdown>
                </div>

                {/* tab */}
                <TabSwitcherWithUnderline
                    tabs={listLsxTab}
                    activeTab={isStateProvider?.productionsOrders?.isTabList}
                    onChange={(tab) => handleActiveTab(tab, "list")}
                    renderLabel={(tab, activeTab) => (
                        <h3
                            className={`${isStateProvider?.productionsOrders?.isTabList?.id === tab.id
                                ? "text-[#0375F3] scale-[1.02]"
                                : "text-[#9295A4] scale-[1]"
                                } font-medium group-hover:text-[#0375F3] transition-all duration-100 ease-linear origin-left`}
                        >
                            <span>{tab.name}</span>
                            {tab.count > 0 && (
                                <span className="absolute top-0 right-0 translate-x-1/2 h-[16px] w-[16px] text-[11px] bg-[#9295A4] text-white rounded-full flex items-center justify-center">
                                    {tab.count}
                                </span>
                            )}
                        </h3>
                    )}
                />
            </div>

            <div className="flex items-start w-full gap-4 overflow-y-hidden  3xl:gap-6">
                <div className="2xl:max-w-[15%] xl:max-w-[18%] max-w-[22%] size-full space-y-4 border-none border-[#D0D5DD] border">
                    <Customscrollbar
                        className="h-full"
                        style={{
                            height: calcAvailableHeight("main"),
                            maxHeight: calcAvailableHeight("main"),
                        }}
                    >
                        {isLoadingProductionOrderList ? (
                            <Loading className="h-full 3xl:h-full 2xl:h-full xl:h-full" />
                        ) : flagProductionOrders?.length > 0 ? (
                            flagProductionOrders?.map((item, eIndex) => {
                                const color = {
                                    0: {
                                        color: "bg-[#FF811A]/15 text-[#C25705]",
                                        title:
                                            dataLang?.productions_orders_produced ??
                                            "productions_orders_produced",
                                    },
                                    1: {
                                        color: "bg-[#3ECeF7]/20 text-[#076A94]",
                                        title:
                                            dataLang?.productions_orders_in_progress ??
                                            "productions_orders_in_progress",
                                    },
                                    2: {
                                        color: "bg-[#35BD4B]/20 text-[#1A7526]",
                                        title:
                                            dataLang?.productions_orders_completed ??
                                            "productions_orders_completed",
                                    },
                                };

                                return (
                                    <div
                                        key={item?.id}
                                        onClick={() => handleShowListDetail(item)}
                                        className={`
                                                        ${typePageMoblie
                                                ? "px-px"
                                                : "pl-1 pr-3"
                                            }
                                                        ${item?.id ==
                                            isStateProvider
                                                ?.productionsOrders
                                                .idDetailProductionOrder &&
                                            "bg-[#F0F7FF]"
                                            }
                                                        ${flagProductionOrders?.length -
                                                1 ==
                                                eIndex
                                                ? "border-b-none"
                                                : "border-b"
                                            }
                                                        py-2 hover:bg-[#F0F7FF] border-[#F7F8F9] cursor-pointer transition-all ease-linear relative`}
                                        style={{
                                            background:
                                                item?.id ===
                                                    isStateProvider?.productionsOrders
                                                        .idDetailProductionOrder
                                                    ? "linear-gradient(90.1deg, rgba(199, 223, 251, 0.21) 0.07%, rgba(226, 240, 254, 0) 94.35%)"
                                                    : "",
                                        }}
                                    >
                                        {/* Gạch xanh bên trái */}
                                        <div className="relative pl-5 xl:space-y-2 space-y-1.5">
                                            {item?.id ===
                                                isStateProvider?.productionsOrders
                                                    .idDetailProductionOrder && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 h-full bg-[#0375F3] rounded-l-lg" />
                                                )}

                                            {isStateProvider?.productionsOrders
                                                .dataProductionOrderDetail?.title && (
                                                    <span
                                                        className={`${color[item?.status_manufacture]?.color
                                                            } xl:text-sm text-xs px-2 py-1 rounded font-normal w-fit h-fit`}
                                                    >
                                                        {color[item?.status_manufacture]?.title}
                                                    </span>
                                                )}
                                            <h1 className="3xl:text-2xl xl:text-xl text-lg font-semibold text-[#003DA0]">
                                                {item?.reference_no}
                                            </h1>

                                            <div className="flex flex-col gap-0.5">
                                                <h3 className="text-[#667085] font-normal 3xl:text-base xl:text-sm text-xs">
                                                    <span>
                                                        {dataLang?.materials_planning_create_on ||
                                                            "materials_planning_create_on"}
                                                        {": "}
                                                    </span>
                                                    <span>
                                                        {formatMoment(
                                                            item?.date,
                                                            FORMAT_MOMENT.DATE_SLASH_LONG
                                                        )}
                                                    </span>
                                                </h3>

                                                <div className="flex flex-wrap items-start gap-x-1">
                                                    <span className="text-[#667085] whitespace-nowrap font-normal 3xl:text-base xl:text-sm text-xs">
                                                        {dataLang?.materials_planning_foloww_up ||
                                                            "materials_planning_foloww_up"}
                                                        :
                                                    </span>
                                                    {item?.listObject?.map((i, index) => (
                                                        <span
                                                            key={index}
                                                            className="text-[#667085] font-normal 3xl:text-base xl:text-sm text-xs"
                                                        >
                                                            {i.reference_no}
                                                            {index < item.listObject.length - 1 && (
                                                                <span>,</span>
                                                            )}
                                                        </span>
                                                    ))}
                                                </div>

                                                <AnimatePresence initial={false}>
                                                    {item?.id ===
                                                        isStateProvider?.productionsOrders
                                                            .idDetailProductionOrder && (
                                                            <motion.div
                                                                key="extra-info"
                                                                layout
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                className="flex flex-col w-full overflow-hidden gap-0.5"
                                                            >
                                                                <h3 className="text-[#667085] font-normal 3xl:text-base xl:text-sm text-xs">
                                                                    <span>
                                                                        {dataLang?.client_list_brand ||
                                                                            "client_list_brand"}
                                                                        :{" "}
                                                                    </span>
                                                                    <span>{item?.name_branch}</span>
                                                                </h3>
                                                            </motion.div>
                                                        )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <NoData className="mt-0" />
                        )}

                        {hasNextPageProductionOrderList && (
                            <LoadingComponent ref={refInviewListLsx} />
                        )}
                    </Customscrollbar>

                    <div ref={paginationRef} className="flex items-center">
                        <LimitListDropdown
                            limit={isStateProvider?.productionsOrders.limit}
                            sLimit={(value) =>
                                queryStateProvider({
                                    productionsOrders: {
                                        ...isStateProvider?.productionsOrders,
                                        limit: value,
                                        page: 1,
                                    },
                                })
                            }
                            dataLang={dataLang}
                            total={dataProductionOrders?.pages[0]?.countAll}
                        />
                    </div>
                </div>

                <div className="2xl:max-w-[85%] xl:max-w-[82%] max-w-[78%] size-full space-y-4 border-none border-[#D0D5DD] border overflow-y-hidden">
                    {!isLoadingProductionOrderDetail &&
                        dataProductionOrderDetail?.listPOItems?.length > 0 &&
                        isStateProvider?.productionsOrders?.isTabList?.type ==
                        "products" && (
                            <div
                                ref={groupButtonRef}
                                className="flex items-center justify-end gap-2 p-0.5 mb-2"
                            >
                                {/* <PopupConfimStage
                                    dataLang={dataLang}
                                    dataRight={isStateProvider?.productionsOrders}
                                    typePageMoblie={typePageMoblie}
                                    refetch={() => {
                                        refetchProductionOrderList();
                                        refetch()
                                    }} 
                                    /> */}

                                <FilterDropdown
                                    trigger={triggerCompleteStage}
                                    style={{
                                        // boxShadow: "0px 20px 24px -4px #10182814, 0px 4px 4px 0px #00000040"
                                        boxShadow: "0px 5px 35px 0px #00000012",
                                    }}
                                    className="flex flex-col !p-0 border-[#D8DAE5] rounded-lg shrink-0 3xl:w-[120%] w-[110%]"
                                    classNameContainer="!w-fit"
                                    dropdownId="dropdownCompleteStage"
                                    placement="bottom-right"
                                >
                                    {listDropdownCompleteStage &&
                                        listDropdownCompleteStage?.map((tab, index) => {
                                            // const isChecked = selected.includes(item.value);
                                            const isFirst = index === 0;
                                            const isLast =
                                                index === listDropdownCompleteStage.length - 1;

                                            const borderClass = isLast
                                                ? "border-transparent rounded-b-lg border-t-transparent"
                                                : isFirst
                                                    ? "rounded-t-lg border-t-transparent"
                                                    : "border-t-transparent";

                                            return (
                                                <div
                                                    key={tab.id}
                                                    className={`hover:bg-[#F3F4F6] border-b border-[#F7F8F9] border-t flex items-center gap-3 cursor-pointer px-4 py-3 custom-transition ${borderClass} select-none`}
                                                    onClick={() =>
                                                        handClickDropdownCompleteStage(tab.type)
                                                    }
                                                >
                                                    {/* nút 'hoàn thành chi tiết' có modal riêng khi là gói pro*/}
                                                    {tab.type === "complete_stage" &&
                                                        dataSeting?.package === "2" ? (
                                                        <PopupConfimStage
                                                            dataLang={dataLang}
                                                            dataRight={isStateProvider?.productionsOrders}
                                                            typePageMoblie={typePageMoblie}
                                                            refetch={() => {
                                                                refetchProductionOrderList();
                                                                refetch();
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <span className="3xl:size-5 size-4 text-[#0375F3] shrink-0">
                                                                {tab.icon}
                                                            </span>
                                                            <span className="3xl:text-base text-sm font-normal text-[#101828]">
                                                                {tab.label}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* {tab.isPremium && (
                                                        <span className="text-[10px] font-normal bg-[#1F2329]/10 text-[#646A73] rounded-[4px] px-2.5 py-1">
                                                            Premium
                                                        </span>
                                                    )} */}
                                                </div>
                                            );
                                        })}
                                </FilterDropdown>

                                <ButtonAnimationNew
                                    icon={
                                        <div className="size-4">
                                            <PrinterIcon className="size-full" />
                                        </div>
                                    }
                                    title="In lệnh sản xuất"
                                    className="3xl:h-10 h-9 xl:px-4 px-2 flex items-center gap-2 xl:text-sm text-xs font-medium text-[#11315B] border border-[#D0D5DD] hover:bg-[#F7F8F9] hover:shadow-hover-button rounded-lg"
                                    onClick={() =>
                                        handPrintManufacture(
                                            isStateProvider?.productionsOrders.idDetailProductionOrder
                                        )
                                    }
                                    isLoading={loadingButton}
                                    disabled={loadingButton}
                                />

                                {/* <ButtonAnimationNew
                                    icon={
                                        <div className="size-4">
                                            <StickerIcon className="size-full" />
                                        </div>
                                    }
                                    title="In tem thành phẩm"
                                    className="3xl:h-10 h-9 xl:px-4 px-2 flex items-center gap-2 xl:text-sm text-xs font-medium text-[#11315B] border border-[#D0D5DD] hover:bg-[#F7F8F9] hover:shadow-hover-button rounded-lg"
                                /> */}

                                <ButtonAnimationNew
                                    icon={
                                        <div className="3xl:size-5 size-4">
                                            <ArrowCounterClockwiseIcon className="size-full" />
                                        </div>
                                    }
                                    onClick={() => {
                                        refetchProductionOrderDetail();
                                    }}
                                    title="Tải lại"
                                    className="3xl:h-10 h-9 xl:px-4 px-2 flex items-center gap-2 xl:text-sm text-xs font-normal text-[#0BAA2E] border border-[#0BAA2E] hover:bg-[#EBFEF2] hover:shadow-hover-button rounded-lg"
                                />

                                <ButtonAnimationNew
                                    icon={
                                        <div className="3xl:size-5 size-4">
                                            <TrashIcon className="size-full" />
                                        </div>
                                    }
                                    onClick={() => {
                                        handleQueryId({
                                            status: true,
                                            id: isStateProvider?.productionsOrders
                                                .idDetailProductionOrder,
                                        });
                                    }}
                                    title="Xoá"
                                    className="3xl:h-10 h-9 xl:px-4 px-2 flex items-center gap-2 xl:text-sm text-xs font-normal text-[#EE1E1E] border border-[#EE1E1E] hover:bg-[#FFEEF0] hover:shadow-hover-button rounded-lg"
                                />
                            </div>
                        )}

                    {isStateProvider?.productionsOrders?.isTabList?.type ==
                        "semiProduct" &&
                        dataProductionOrderDetail?.listPOItems?.length > 0 && !isLoadingProductionOrderDetail && (
                            <div
                                ref={groupButtonRef}
                                className="flex items-center justify-end gap-2 p-0.5 mb-2"
                            >
                                <ButtonAnimationNew
                                    icon={
                                        <div className="size-4">
                                            <PrinterIcon className="size-full" />
                                        </div>
                                    }
                                    title="In kế hoạch BTP & NVL"
                                    className="3xl:h-10 h-9 xl:px-4 px-2 flex items-center gap-2 xl:text-sm text-xs font-medium text-[#11315B] border border-[#D0D5DD] hover:bg-[#F7F8F9] hover:shadow-hover-button rounded-lg"
                                    onClick={() => {
                                        handPrintPlanManufacture(
                                            isStateProvider?.productionsOrders
                                                ?.dataProductionOrderDetail?.pp_id
                                        );
                                    }}
                                    isLoading={loadingButton}
                                    disabled={loadingButton}
                                />
                            </div>
                        )}

                    <Customscrollbar
                        className="h-full pr-3"
                        style={{
                            height: calcAvailableHeight("submain"),
                            maxHeight: calcAvailableHeight("submain"),
                        }}
                    >
                        {isLoadingProductionOrderDetail ||
                            isRefetchingProductionOrderDetail ||
                            isRefetchingProductionOrderList ||
                            isLoadingProductionOrderList ? (
                            <Loading className="3xl:h-full 2xl:h-full xl:h-full h-full" />
                        ) : dataProductionOrderDetail?.listPOItems?.length > 0 ? (
                            <React.Fragment>
                                {isStateProvider?.productionsOrders?.isTabList?.type ==
                                    "products" && <DetailProductionOrderList {...shareProps} />}
                                {isStateProvider?.productionsOrders?.isTabList?.type ==
                                    "semiProduct" && <PlaningProductionOrder {...shareProps} />}
                                {/* {isStateProvider?.productionsOrders.isTab == "semiProduct" && <PlaningProductionOrder {...shareProps} />} */}
                            </React.Fragment>
                        ) : (
                            <NoData className="mt-0" />
                        )}
                    </Customscrollbar>
                </div>
            </div>

            <ModalDetail {...shareProps} />
            {/* <SheetProductionsOrderDetail {...shareProps} /> */}
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                title={TITLE_DELETE_PRODUCTIONS_ORDER}
                subtitle={CONFIRM_DELETION}
                isOpen={isOpen}
                save={() => {
                    handleConfim();
                }}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment>
    );
};
export default ProductionsOrderMain;
