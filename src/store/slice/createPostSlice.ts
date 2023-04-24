import {createSlice} from '@reduxjs/toolkit';

export type modalTypes =
  | 'NUMBER_OF_MATES'
  | 'FLEXIBILITY'
  | 'LOOKING_FOR'
  | 'WORK_WITH_TRAVEL'
  | 'CATEGORY'
  | 'DIFFICULTY';
interface CreatePostSliceState {
  selectedCreatePostOption: null | {
    id: number;
    title: string;
  };
  destinationList: {}[];
  destinationPhotoIdsList: {}[];
  destinationPhotoList: {}[];
  categoryList: {
    id: number;
    title: string;
    value: string;
    isSelected: boolean;
  }[];
  customModalResult: {
    NUMBER_OF_MATES: {
      title: string;
      value: string;
    };
    FLEXIBILITY: {
      title: string;
      value: string;
    };
    LOOKING_FOR: {
      title: string;
      value: string;
    };
    WORK_WITH_TRAVEL: {
      title: string;
      value: boolean;
    };
    CATEGORY: {
      title: string;
      value: string;
    };
    DIFFICULTY: {
      title: string;
      value: string;
    };
  };
  stepOneData: {
    title: string;
    minBudget: string;
    maxBudget: string;
    description: string;
    matesNumber: number;
  };
  editTourData: any;
  editTourId: null | string;
}

const initialState: CreatePostSliceState = {
  selectedCreatePostOption: null,
  destinationList: [],
  destinationPhotoIdsList: [],
  destinationPhotoList: [],
  customModalResult: {
    NUMBER_OF_MATES: {
      title: '',
      value: '',
    },
    FLEXIBILITY: {
      title: '',
      value: '',
    },
    LOOKING_FOR: {
      title: '',
      value: '',
    },
    WORK_WITH_TRAVEL: {
      title: '',
      value: false,
    },
    CATEGORY: {
      title: '',
      value: '',
    },
    DIFFICULTY: {
      title: '',
      value: '',
    },
  },
  stepOneData: {
    title: '',
    minBudget: '',
    maxBudget: '',
    description: '',
    matesNumber: 0,
  },
  categoryList: [],
  editTourData: null,
  editTourId: null,
};

const createPostSlice = createSlice({
  name: 'CreatePostSlice',
  initialState,
  reducers: {
    setSelectedCreatePostOption: (state, action) => {
      state.selectedCreatePostOption = action.payload;
    },
    setDestinationList: (state, action) => {
      state.destinationList = action.payload;
    },
    setDestinationPhotoIdsList: (state, action) => {
      state.destinationPhotoIdsList = action.payload;
    },
    setDestinationPhotoList: (state, action) => {
      state.destinationPhotoList = action.payload;
    },
    setCustomModalResult: (state, action) => {
      state.customModalResult = action.payload;
    },
    setStepOneData: (state, action) => {
      state.stepOneData = action.payload;
    },
    setCategoryList: (state, action) => {
      state.categoryList = action.payload;
    },
    setEditTourData: (state, action) => {
      state.editTourData = action.payload;
    },
    setEditTourId: (state, action) => {
      state.editTourId = action.payload;
    },
    setClearCreatePostData: (state, action) => {
      state.destinationList = [];
      state.editTourData = null;
      state.editTourId = null;
      state.destinationPhotoIdsList = [];
      state.destinationPhotoList = [];
      state.customModalResult = {
        NUMBER_OF_MATES: {
          title: '',
          value: '',
        },
        FLEXIBILITY: {
          title: '',
          value: '',
        },
        LOOKING_FOR: {
          title: '',
          value: '',
        },
        WORK_WITH_TRAVEL: {
          title: '',
          value: false,
        },
        CATEGORY: {
          title: '',
          value: '',
        },
        DIFFICULTY: {
          title: '',
          value: '',
        },
      };
      state.stepOneData = {
        title: '',
        minBudget: '',
        maxBudget: '',
        description: '',
        matesNumber: 0,
      };
    },
  },
});

export const {
  setSelectedCreatePostOption,
  setDestinationList,
  setDestinationPhotoIdsList,
  setCustomModalResult,
  setDestinationPhotoList,
  setStepOneData,
  setClearCreatePostData,
  setCategoryList,
  setEditTourData,
  setEditTourId,
} = createPostSlice.actions;

export default createPostSlice.reducer;
