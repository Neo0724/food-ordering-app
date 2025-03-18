package com.example.canteen.food.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResultCode {
    private Integer code;
    private String msg;
    private Object data;


    public static ResultCode success() {
        ResultCode result = new ResultCode();
        result.code = 1;
        result.msg = "success";
        return result;
    }

    public static ResultCode success(Object object) {
        ResultCode result = new ResultCode();
        result.data = object;
        result.code = 1;
        result.msg = "success";
        return result;
    }

    public static ResultCode error( String msg) {
        ResultCode result = new ResultCode();
        result.code = 0;
        result.msg = msg;
        return result;
    }
}
