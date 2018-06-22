<?php

require_once 'config.php';

try {
    $DB = new PDO(DB_DSN, DB_USER, DB_PASS);
}
catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}

if (isset($_POST['data'])) {

    try {
        //delete old rows
        $query = $DB->prepare('DELETE FROM todolist');
        $query->execute(array(
            ':table' => 'todolist'
        ));
        // echo "SUCCESS";
    }
    catch(PDOException $e) {
        echo "FAILURE:" . $e->getMessage();
    }

    $data = json_decode($_POST['data']);
    // echo $data;


    try {
        //insert new rows
        for ($i=0; $i < count($data); $i++) {
            // $item_text = $data[$i]->text;
            // $item_checked = $data[$i]->checked;
            // $item_data = $data[$i]->date;

            // $query = "INSERT INTO todolist (text, checked, data) VALUES ('$item_text', '$item_checked', '$item_data')";
            // $result = $DB->prepare($query);
            // // $result->bindParam("sss", $item_text, $item_checked, $item_data);
            // $result->execute();

            $statement = "INSERT INTO todolist (text, checked, date) VALUES (:text, :checked, :date)";

            if($data[$i]->checked==false){
                $data[$i]->checked = 0;
            }
            // echo $data[$i]->text;
            // echo $data[$i]->checked;
            // echo $data[$i]->date;

            $query = $DB->prepare($statement);
            $query->execute(array(
                ':text' => $data[$i]->text,
                ':checked' => $data[$i]->checked,
                ':date' => $data[$i]->date
            ));
        }
        echo "SUCCESS";
    }
    catch(PDOException $e) {
        echo "FAILURE:" . $e->getMessage();
    }
}
else {
    echo "No data found.";
}

?>