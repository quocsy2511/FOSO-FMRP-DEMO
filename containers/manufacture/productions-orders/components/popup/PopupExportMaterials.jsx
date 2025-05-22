import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CheckIcon from "@/components/icons/common/CheckIcon";
import {
    default as formatNumber,
    default as formatNumberConfig,
} from "@/utils/helpers/formatnumber";
import useSetingServer from "@/hooks/useConfigNumber";
import CloseXIcon from "@/components/icons/common/CloseXIcon";
import { Lexend_Deca } from "@next/font/google";
import CheckboxDefault from "@/components/common/checkbox/CheckboxDefault";
import { Tooltip } from "react-tippy";
import MagnifyingGlassIcon from "@/components/icons/common/MagnifyingGlassIcon";
import { twMerge } from "tailwind-merge";
import useToast from "@/hooks/useToast";
import { FaMinus, FaPlus } from "react-icons/fa";
import Image from "next/image";
import { FiChevronDown, FiPlus } from "react-icons/fi";
import ArrowUpIcon from "@/components/icons/common/ArrowUpIcon";
import { IoIosAlert } from "react-icons/io";
import { MdArrowDropDown } from "react-icons/md";

const dumyData = [
    {
        id: 1,
        selected: false,
        item_name: "Bột mì đa dụng",
        item_code: "BOTMI01",
        product_variation: "Bao 25kg",
        images: "",
        quality: "3,000",
        material: "Kg",
        quantity_success: "1,000",
        subMenu: [
            {
                id: 1, // ID tạm, tránh lỗi key
                code: "987456321ZYX",
                date: "30/03/2025",
                warehouse: "Tầng hầm",
                quantity: 1000,

            },
            {
                id: 2, // ID tạm, tránh lỗi key
                code: "987456321ZYX",
                date: "30/03/2025",
                warehouse: "Tầng 2",
                quantity: 10000,

            },
        ]
    },
    {
        id: 2,
        selected: false,
        item_name: "Đường tinh luyện",
        item_code: "DUONG02",
        product_variation: "Bao 50kg",
        images: "",
        quality: "3,000",
        material: "Kg",
        quantity_success: "1,000",
        subMenu: [
            {
                id: 1, // ID tạm, tránh lỗi key
                code: "987456321ZYX",
                date: "30/03/2025",
                warehouse: "Tầng 5",
                quantity: 500,

            },
            {
                id: 2, // ID tạm, tránh lỗi key
                code: "987456321ZYX",
                date: "30/03/2025",
                warehouse: "Tầng 1",
                quantity: 100,

            },
        ]
    },
    {
        id: 3,
        selected: false,
        item_name: "Trứng gà tươi",
        item_code: "TRUNG03",
        product_variation: "Vỉ 10 quả",
        images: "",
        quality: "3,000",
        material: "Quả",
        quantity_success: "1,000",
        subMenu: [
        ]
    },
    {
        id: 4,
        selected: false,
        item_name: "Trứng gà tươi",
        item_code: "TRUNG03",
        product_variation: "Vỉ 10 quả",
        images: "",
        quality: "3,000",
        material: "Quả",
        quantity_success: "1,000",
        subMenu: [
        ]
    },

];

const deca = Lexend_Deca({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const warehouseOptions = [
    {
        label: "Kho nguyên vật liệu",
        options: ["Tầng hầm", "Tầng trệt", "Tầng 2"],
    },
    {
        label: "Kho sản xuất",
        options: ["Tầng 5", "Tầng 10"],
    },
    {
        label: "Kho thành phẩm",
        options: ["Tầng 1"],
    },
];

const CustomDropdownRadioGroup = ({
    data,
    value,
    onChange,
    placeholder = "Chọn kho hàng",
    className = "",
}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Tính chiều rộng tối thiểu dựa trên label dài nhất
    const maxLabelLength = Math.max(...data.map(group => group.label.length));
    const minColumnWidth = Math.max(160, maxLabelLength * 8);

    const selectedLabelGroup = data.find(group => group.options.includes(value));
    const displayText = selectedLabelGroup ? `${selectedLabelGroup.label} - ${value}` : placeholder;

    return (
        <div className={`relative ${className}`} ref={ref}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex justify-between items-center w-full text-[#3A3E4C] font-medium border border-[#D0D5DD]  px-3 py-2 text-sm bg-white rounded-lg"
            >
                <span className="truncate">
                    {value ? displayText : <span className="text-[#3A3E4C]">{placeholder}</span>}
                </span>
                <MdArrowDropDown className="text-[#9295A4]" size={25} />

            </button>

            {open && (
                <div className="absolute top-full mt-1 left-0 min-w-max rounded-xl bg-[#FFFFFF] shadow-sm border z-50 p-3 max-h-80 overflow-y-auto">
                    <div className="flex gap-y-2 flex-col">
                        {data.map((group, groupIndex) => (
                            <div
                                key={groupIndex}
                                className="flex-shrink-0"
                                style={{ minWidth: `${minColumnWidth}px` }}
                            >
                                <p className="font-semibold text-[#003DA0] uppercase text-xs ">
                                    {group.label}
                                </p>
                                <div >
                                    {group.options.map((option, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 py-2 rounded cursor-pointer hover:bg-blue-50 transition-colors px-2"
                                            onClick={() => {
                                                onChange(option);
                                                setOpen(false);
                                            }}
                                        >
                                            <div className={twMerge("w-4 h-4 rounded-full border-2  flex items-center justify-center flex-shrink-0",
                                                value === option ? "border-[#0375F3]" : "border-[#D0D5DD]"
                                            )}>
                                                {value === option && (
                                                    <div className="w-2 h-2 rounded-full bg-[#0375F3]" />
                                                )}
                                            </div>
                                            <span className="text-[#141522] text-xs font-normal">{option}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const InputNumberCustom = memo(
    ({
        state = 0,
        setState,
        className,
        classNameButton,
        classNameInput,
        min = 0,
        max = Infinity,
        disabled = false,
        isError = false,
    }) => {
        const [inputValue, setInputValue] = useState(state || 0);
        const [formattedValue, setFormattedValue] = useState(
            formatNumber(state || 0)
        );

        useEffect(() => {
            setInputValue(state || 0);
            setFormattedValue(formatNumber(state || 0));
        }, [state]);

        const parseToNumber = useCallback(
            (value) => {
                const cleaned = value.toString().replace(/\D/g, "");
                const parsed = parseInt(cleaned);
                return isNaN(parsed) ? min : parsed;
            },
            [min]
        );

        const handleChange = useCallback(
            (type) => {
                if (disabled) return;
                const current = parseToNumber(state);
                let result = current;
                if (type === "increment" && current < max) result = current + 1;
                if (type === "decrement" && current > min) result = current - 1;
                setState(result);
            },
            [disabled, state, parseToNumber, max, min, setState]
        );

        const handleInputChange = useCallback(
            (e) => {
                if (disabled) return;
                const value = e.target.value;

                if (value === "") {
                    setInputValue("");
                    setFormattedValue("");
                    return;
                }

                const numericValue = value.replace(/\D/g, "");

                if (numericValue === "") {
                    setInputValue("");
                    setFormattedValue("");
                    return;
                }

                const numValue = parseInt(numericValue);
                setInputValue(numValue);
                setFormattedValue(formatNumber(numValue));
            },
            [disabled]
        );

        const handleBlur = useCallback(() => {
            if (inputValue === "") {
                setState(min);
                setInputValue(min);
                setFormattedValue(formatNumber(min));
                return;
            }

            const number = parseToNumber(inputValue);

            if (number < min) {
                setState(min);
                setInputValue(min);
                setFormattedValue(formatNumber(min));
            } else if (number > max) {
                setState(max);
                setInputValue(max);
                setFormattedValue(formatNumber(max));
            } else {
                setState(number);
                setInputValue(number);
                setFormattedValue(formatNumber(number));
            }
        }, [inputValue, min, max, parseToNumber, setState]);

        const handleButtonClick = useCallback(
            (e, type) => {
                e.preventDefault();
                e.stopPropagation();

                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                } else if (document.selection) {
                    document.selection.empty();
                }

                handleChange(type);
            },
            [handleChange]
        );

        return (
            <div
                className={twMerge(
                    "p-2 flex items-center border rounded-full shadow-sm border-[#D0D5DD] w-fit h-fit overflow-hidden",
                    disabled ? "opacity-50 cursor-not-allowed" : "",
                    className
                )}
                onMouseDown={(e) => e.preventDefault()}
            >
                <div
                    onClick={(e) => handleButtonClick(e, "decrement")}
                    onMouseDown={(e) => e.preventDefault()}
                    className={twMerge(
                        "size-9 rounded-full cursor-pointer bg-primary-05 flex justify-center items-center flex-row",
                        classNameButton
                    )}
                >
                    <FaMinus className="text-[#25387A] hover:text-green-1" size={11} />
                </div>
                <input
                    disabled={disabled}
                    type="text"
                    value={formattedValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onMouseDown={(e) => e.stopPropagation()}
                    className={twMerge(
                        "w-20 text-center outline-none text-lg font-normal text-secondary-09 bg-transparent",
                        isError && inputValue > 0 ? "text-red-500" : "",
                        classNameInput
                    )}
                />
                <div
                    onClick={(e) => handleButtonClick(e, "increment")}
                    onMouseDown={(e) => e.preventDefault()}
                    className={twMerge(
                        "size-9 rounded-full cursor-pointer bg-primary-05 flex justify-center items-center flex-row",
                        classNameButton
                    )}
                >
                    <FaPlus className="text-[#25387A] hover:text-green-1" size={10} />
                </div>
            </div>
        );
    }
);

const variantsContent = {
    open: { height: "auto", opacity: 1 },
    closed: { height: 0, opacity: 0 },
};

const CollapseRowWrapper = ({ isOpen, children }) => {
    return (
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    className=""
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={variantsContent}
                    transition={{ duration: 0.3 }}
                >
                    <div>{children}</div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const SubProductRow = memo(
    ({
        id, isOpen, lot, date, quantity, setLotRows, updateProductQuantity, index, warehouse, lastIndex
    }) => {
        const [selectedWarehouse, setSelectedWarehouse] = useState(warehouse ?? "");

        return (
            <tr key={id} >
                <td
                    colSpan={12}
                    className="p-0 border-t border-[#F3F3F4] bg-[#EBF5FF] bg-opacity-50"
                >
                    <CollapseRowWrapper isOpen={isOpen}>
                        <table className="w-full border-separate border-spacing-0">
                            <tbody>
                                {/* Dòng LOT 1 */}
                                <tr>
                                    <td className="py-2 px-3 text-center  w-[62px]">
                                    </td>
                                    <td className="py-2 px-3 text-center w-[62px]">
                                    </td>
                                    <td className="py-2 px-3 text-left ">
                                        <div className=" flex gap-x-4 justify-between items-center">
                                            {warehouse ?
                                                <div className="flex flex-row gap-x-2 text-[#3276FA] text-xs font-normal">
                                                    <p>LOT: {lot}</p>
                                                    <p>Date: {date}</p>
                                                </div>
                                                : <div className="text-xs font-normal text-[#991B1B] flex items-start gap-x-[2px]">
                                                    <IoIosAlert className="text-[#991B1B]" size={17} />
                                                    <p>Vui lòng chọn kho hàng của NVL để tiến hành xuất kho!</p>
                                                </div>}
                                            <CustomDropdownRadioGroup
                                                data={warehouseOptions}
                                                value={selectedWarehouse}
                                                onChange={setSelectedWarehouse}
                                            />
                                        </div>
                                    </td>
                                    <td className="py-2 px-3 text-center w-[200px]">
                                        <div className="flex  justify-start">
                                            <InputNumberCustom
                                                state={quantity}
                                                setState={(value) =>
                                                    updateProductQuantity(index, value)
                                                }
                                            />
                                        </div>
                                    </td>
                                    <td className="py-2 px-3 text-center w-[100px]">
                                        <button className="text-gray-400 hover:text-red-600"
                                            onClick={() =>
                                                setLotRows((prev) =>
                                                    prev.filter((row) => row.id !== id)
                                                )
                                            }>
                                            <CloseXIcon className="size-7" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </CollapseRowWrapper>
                </td>
            </tr>
        )
    }
)

const ProductRow = memo(
    ({
        product,
        index,
        updateProductQuantity,
        updateProductError,
        handleSelectProduct,
        handleAction,
        classNameButton,
    }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [lotRows, setLotRows] = useState(product.subMenu);
        const handleAddLotRow = () => {
            setIsOpen(true); // mở collapse nếu chưa mở
            setLotRows((prev) => [
                {
                    id: Date.now(),
                    code: "987456321ZYX",
                    date: "30/03/2025",
                    warehouse: "",
                    quantity: 0,
                },
                ...prev,
            ]);
        };

        useEffect(() => {
            if (product.subMenu.length > 0) {
                setIsOpen(true)
            }
        }, [lotRows])

        return (
            <>
                <tr className="hover:bg-gray-50">
                    <td className="py-2 px-3 text-center w-[62px]">
                        <CheckboxDefault
                            checked={product.selected}
                            onChange={(checked) => handleSelectProduct(index, checked)}
                        />
                    </td>
                    <td className="py-2 px-3 text-center text-sm font-semibold w-[62px]">
                        {index + 1}
                    </td>
                    <td className="py-2 px-3 text-left">
                        <div className="flex gap-2">
                            <div className="w-16 h-16 rounded flex items-center justify-center">
                                <Image
                                    src={product.images || "/icon/default/default.png"}
                                    alt={product.name}
                                    width={64}
                                    height={64}
                                    className="object-cover rounded"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-sm font-semibold text-[#141522] truncate">
                                    {product.item_name}
                                </h3>
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-[10px] font-normal text-[#667085]">
                                        {product.product_variation}
                                    </p>
                                    <p className="text-xs font-normal text-typo-blue-2">
                                        {product.item_code}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="py-2 px-3 text-center w-[200px]">
                        <div className="flex  justify-center">
                            <div className="text-start">
                                <p className="text-[#EE1E1E] font-medium text-lg">
                                    {product.quality}{" "}
                                    <span className="text-[#141522] font-medium text-xs">/</span>
                                </p>
                                <span className="text-[#141522] text-xs font-medium">
                                    {product.material}
                                </span>
                            </div>
                        </div>
                    </td>
                    <td className="py-2 px-3 text-center w-[100px]">
                        <div className="flex justify-center">
                            <div
                                onClick={handleAddLotRow}
                                className={twMerge(
                                    "min-h-[35px]  min-w-[35px] flex justify-center items-center flex-row rounded-full bg-[#EBF5FF] border border-transparent hover:border-[#1760B9] hover:bg-[#D0E8FF] hover:scale-110 transition-all duration-200 ease-out",
                                    classNameButton
                                )}
                            >
                                <FiPlus
                                    className="text-[#003DA0] hover:text-green-1"
                                    size={19}
                                />
                            </div>
                        </div>
                    </td>
                </tr>

                {/* subAddItem */}
                {lotRows.map((lot, index) => (
                    <SubProductRow key={lot.id}
                        id={lot.id}
                        lot={lot.code}
                        date={lot.date}
                        quantity={lot.quantity}
                        warehouse={lot.warehouse}
                        isOpen={isOpen}
                        index={index}
                        setLotRows={setLotRows}
                        updateProductQuantity={(i, value) =>
                            setLotRows((prev) =>
                                prev.map((row, j) =>
                                    j === index ? { ...row, quantity: value } : row
                                )
                            )
                        }
                        lastIndex={lotRows.length - 1}
                    />
                ))}
            </>
        );
    }
);

const PopupExportMaterials = ({ onClose }) => {
    const [selectAll, setSelectAll] = useState(false);
    const [products, setProducts] = useState(dumyData);
    const dataSeting = useSetingServer();
    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };
    const showToast = useToast();
    const handleSelectAll = useCallback((checked) => {
        setSelectAll(checked);
        setProducts((prevProducts) =>
            prevProducts.map((product) => ({
                ...product,
                selected: checked,
            }))
        );
    }, []);

    const updateProductQuantity = useCallback(
        (index, value) => {
            if (value === 0) {
                showToast("error", "SL đạt không được phép bằng 0!");
                return;
            }

            setProducts((prevProducts) => {
                const updatedProducts = [...prevProducts];
                updatedProducts[index] = {
                    ...updatedProducts[index],
                    quantity_success: value,
                };
                console.log(updatedProducts);
                return updatedProducts;
            });
        },
        [showToast]
    );

    const updateProductError = useCallback((index, value) => {
        setProducts((prevProducts) => {
            const updatedProducts = [...prevProducts];
            updatedProducts[index] = {
                ...updatedProducts[index],
                error: value,
            };
            return updatedProducts;
        });
    }, []);

    const handleSelectProduct = useCallback((index, checked) => {
        setProducts((prevProducts) => {
            const updatedProducts = [...prevProducts];
            updatedProducts[index] = {
                ...updatedProducts[index],
                selected: checked,
            };

            const allSelected = updatedProducts.every((product) => product.selected);
            setSelectAll(allSelected);

            return updatedProducts;
        });
    }, []);

    const handleAction = () => { };

    const selectedCount = useMemo(
        () => products.filter((product) => product.selected).length,
        [products]
    );
    const confirmButtonClass = useMemo(
        () =>
            `flex items-center gap-2 text-sm font-medium rounded-lg py-3 px-4 w-fit text-white ${selectedCount > 0 ? "bg-background-blue-2" : "bg-neutral-02"
            } `,
        [selectedCount]
    );

    const handleConfirm = () => { };

    return (
        <div
            className={`p-6 flex flex-col gap-6 rounded-3xl w-[90vw] xl:w-[1085px] max-h-[90vh] bg-neutral-00 ${deca.className}`}
        >
            <div className="flex gap-2 justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold capitalize">Xuất kho sản xuất</h2>
                    <p className="text-base text-typo-blue-4">LSX-13032514</p>
                </div>
                <div className="flex gap-8 items-center">
                    <button
                        onClick={handleConfirm}
                        //   disabled={selectedCount === 0 || isLoadingSubmit}
                        className={confirmButtonClass}
                    >
                        <CheckIcon className="size-4" /> Xác nhận
                    </button>
                    <motion.div
                        whileHover={{ scale: 1.2, rotate: 90 }}
                        whileTap={{ scale: 0.9, rotate: -90 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="size-6 shrink-0 text-neutral-02 cursor-pointer"
                        onClick={onClose}
                    >
                        <CloseXIcon className="size-full" />
                    </motion.div>
                </div>
            </div>
            {/* search */}
            <div class="flex gap-x-2 items-center w-full rounded-lg border border-[#D0D5DD] px-4 py-2 focus-within:border-transparent  focus-within:ring-2 focus-within:ring-blue-500">
                <input
                    type="text"
                    placeholder="Tìm kiếm"
                    class="flex-1 border-none outline-none text-[#3A3E4C] placeholder-gray-200"
                />
                <button class="rounded-lg bg-[#1760B9] p-1 ">
                    <MagnifyingGlassIcon className="size-4 text-white" />
                </button>
            </div>
            {/* table */}
            <div className=" overflow-hidden">

                <table className="min-w-full border-separate border-spacing-0  table-fixed ">
                    <thead className="bg-white sticky top-0 z-10">
                        <tr>
                            <th className="py-2 px-3 border-b border-gray-200 text-center text-sm font-normal text-[#9295A4] w-[62px]">
                                <Tooltip title="Chọn tất cả" position="bottom" arrow={true}>
                                    <CheckboxDefault
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    />
                                </Tooltip>
                            </th>
                            <th className="py-2 px-3 border-b border-gray-200 text-center text-sm font-normal text-[#9295A4] w-[62px]">
                                STT
                            </th>
                            <th className="py-2 px-3 border-b border-gray-200 text-left text-sm font-normal text-[#9295A4]">
                                Nguyên vật liệu
                            </th>
                            <th className="py-2 px-3 border-b border-gray-200 text-center text-sm font-normal text-[#9295A4] w-[200px]">
                                Số lượng
                            </th>
                            <th className="py-2 px-3 border-b border-gray-200 text-center text-sm font-normal text-[#9295A4] w-[115px]">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                </table>
                <div className="max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                    <table className="min-w-full table-fixed border-separate border-spacing-0">
                        <tbody>
                            {products.map((product, index) => (
                                <ProductRow
                                    key={`product-row-${product.id || index}`}
                                    product={product}
                                    index={index}
                                    updateProductQuantity={updateProductQuantity}
                                    updateProductError={updateProductError}
                                    handleSelectProduct={handleSelectProduct}
                                    handleAction={handleAction}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default PopupExportMaterials;
